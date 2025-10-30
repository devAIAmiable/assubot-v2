import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import React, { Fragment, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { usersService } from '../../services/users';
import { batchUserInputSchema, batchUsersPayloadSchema, type BatchUsersPayload, type BatchUsersResource } from '../../schemas/users';

type FormSchema = z.infer<typeof batchUsersPayloadSchema>;

interface BatchCreateUsersModalProps {
  open: boolean;
  onClose: () => void;
}

const requiredColumns: Array<keyof z.infer<typeof batchUserInputSchema>> = ['email', 'password', 'firstName', 'lastName'];

const optionalColumns: Array<keyof z.infer<typeof batchUserInputSchema>> = ['gender', 'birthDate', 'phone', 'profession', 'avatar', 'address', 'city', 'state', 'zip', 'country'];

const defaultRow: z.infer<typeof batchUserInputSchema> = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  gender: undefined,
  birthDate: undefined,
  phone: undefined,
  profession: undefined,
  avatar: undefined,
  address: undefined,
  city: undefined,
  state: undefined,
  zip: undefined,
  country: undefined,
};

const BatchCreateUsersModal: React.FC<BatchCreateUsersModalProps> = ({ open, onClose }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<BatchUsersResource | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const resolver = useMemo(() => zodResolver(batchUsersPayloadSchema), []);

  const { control, handleSubmit, formState, reset } = useForm<FormSchema>({
    resolver,
    defaultValues: { initialCredits: 0, users: [defaultRow] },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'users' });

  const onAddRow = () => append({ ...defaultRow });
  const onRemoveRow = (index: number) => remove(index);
  const onReset = () => {
    setResult(null);
    setServerError(null);
    reset({ initialCredits: 0, users: [defaultRow] });
  };

  const onSubmit = async (data: FormSchema) => {
    setServerError(null);
    setResult(null);
    const response = await usersService.batchCreate(data as BatchUsersPayload);
    if (response.success) {
      setResult(response.data?.resource ?? null);
    } else {
      setServerError(response.error || 'Échec de la création en lot');
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative bg-white rounded-2xl mx-auto shadow-xl max-w-6xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Créer des utilisateurs en lot</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Saisissez plusieurs utilisateurs à créer d’un coup.</p>
                      <button type="button" onClick={() => setShowAdvanced((s) => !s)} className="mt-2 text-sm text-[#1e51ab] hover:underline">
                        {showAdvanced ? 'Masquer les champs avancés' : 'Afficher les champs avancés'}
                      </button>
                    </div>

                    <div className="w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Crédits initiaux</label>
                      <Controller
                        control={control}
                        name="initialCredits"
                        render={({ field }) => (
                          <input
                            type="number"
                            min={0}
                            step={1}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e51ab]"
                            value={Number.isFinite(field.value as number) ? (field.value as number) : 0}
                            onChange={(e) => {
                              const value = e.target.value;
                              const next = value === '' ? 0 : Number(e.target.value);
                              field.onChange(next);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        )}
                      />
                      {formState.errors.initialCredits?.message && <p className="text-red-600 text-sm mt-1">{formState.errors.initialCredits.message}</p>}
                    </div>
                  </div>

                  <div className="overflow-auto border rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          {requiredColumns.map((col) => (
                            <th key={col} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {col}
                            </th>
                          ))}
                          {showAdvanced &&
                            optionalColumns.map((col) => (
                              <th key={col} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {col}
                              </th>
                            ))}
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fields.map((field, index) => (
                          <tr key={field.id}>
                            <td className="px-3 py-2 text-sm text-gray-500">{index + 1}</td>
                            {requiredColumns.map((col) => (
                              <td key={col} className="px-3 py-2">
                                <Controller
                                  control={control}
                                  name={`users.${index}.${col}` as const}
                                  render={({ field }) => (
                                    <input
                                      type={col === 'password' ? 'password' : 'text'}
                                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e51ab]"
                                      {...field}
                                    />
                                  )}
                                />
                                {/* @ts-expect-error dynamic path */}
                                {formState.errors.users?.[index]?.[col]?.message && (
                                  // @ts-expect-error dynamic path
                                  <p className="text-red-600 text-xs mt-1">{formState.errors.users?.[index]?.[col]?.message as string}</p>
                                )}
                              </td>
                            ))}

                            {showAdvanced &&
                              optionalColumns.map((col) => (
                                <td key={col} className="px-3 py-2">
                                  <Controller
                                    control={control}
                                    name={`users.${index}.${col}` as const}
                                    render={({ field }) => (
                                      <input type="text" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e51ab]" {...field} />
                                    )}
                                  />
                                  {/* @ts-expect-error dynamic path */}
                                  {formState.errors.users?.[index]?.[col]?.message && (
                                    // @ts-expect-error dynamic path
                                    <p className="text-red-600 text-xs mt-1">{formState.errors.users?.[index]?.[col]?.message as string}</p>
                                  )}
                                </td>
                              ))}

                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => onRemoveRow(index)}
                                className="text-red-600 hover:text-red-700 p-2"
                                aria-label={`Supprimer la ligne ${index + 1}`}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={onAddRow} className="inline-flex items-center gap-2 bg-[#1e51ab] text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <FaPlus />
                        <span>Ajouter une ligne</span>
                      </button>

                      <button type="button" onClick={onReset} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">
                        Réinitialiser
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={formState.isSubmitting || !formState.isValid}
                        className="px-6 py-2 rounded-lg bg-[#1e51ab] text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {formState.isSubmitting ? 'Création…' : 'Créer'}
                      </button>
                    </div>
                  </div>
                </form>

                {(serverError || result) && (
                  <div className="mt-6">
                    {serverError && <p className="text-red-600 font-medium">{serverError}</p>}

                    {result && (
                      <div className="bg-gray-50 border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">Résultats</h3>
                          <div className="text-sm text-gray-600">
                            Total: {result.summary.total} • Réussites: {result.summary.successCount} • Échecs: {result.summary.failureCount}
                          </div>
                        </div>
                        <div className="max-h-64 overflow-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="text-left text-xs text-gray-500">
                                <th className="px-2 py-1">Email</th>
                                <th className="px-2 py-1">Statut</th>
                                <th className="px-2 py-1">ID</th>
                                <th className="px-2 py-1">Erreur</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.results.map((r) => (
                                <tr key={r.email} className="text-sm border-t">
                                  <td className="px-2 py-1">{r.email}</td>
                                  <td className="px-2 py-1">{r.success ? '✅' : '❌'}</td>
                                  <td className="px-2 py-1">{r.userId || '-'}</td>
                                  <td className="px-2 py-1 text-red-600">{r.error || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BatchCreateUsersModal;

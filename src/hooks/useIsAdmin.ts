import { useAppSelector } from '../store/hooks';

/**
 * Hook to check if the current user is an admin
 * Admins are identified by having an @a-lamiable.com email address
 */
export const useIsAdmin = (): boolean => {
  const user = useAppSelector((state) => state.user?.currentUser);

  // FIXME: This is a temporary solution to check if the user is an admin. We should use a more robust solution in the future.
  // Check if user email ends with @a-lamiable.com
  return user?.email?.endsWith('@a-lamiable.com') || user?.email?.endsWith('@axa.fr') || false;
};

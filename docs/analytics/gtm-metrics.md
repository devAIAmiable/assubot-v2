# GTM – suivi des métriques clés

Cette note résume la configuration Google Tag Manager et les événements envoyés dans `dataLayer`.

## Configuration

- `VITE_ENABLE_ANALYTICS` : active l’injection GTM lorsque `true`.
- `VITE_GTM_CONTAINER_ID` : identifiant du conteneur (`GTM-W2JQ2V3K` en production).
- `GtmProvider` initialise `dataLayer` et ajoute un événement `gtm_provider_ready` avec le couple `{ app_environment, app_version }`.
- Le snippet GTM est inséré dynamiquement dans `index.html` si les variables ci-dessus sont définies.

## Convention d’événements

Chaque événement GTM ajoute automatiquement :

- `app_environment` – valeur de `config.environment`
- `app_version` – valeur de `config.appVersion`

Tous les champs d’événement sont en anglais pour faciliter l’exploitation dans GTM et les outils d’analyse.

### Général

| Événement             | Déclencheur                                 | Payload spécifique                  |
| --------------------- | ------------------------------------------- | ----------------------------------- |
| `page_view`           | `RouteTracker` (changement de route)        | `page_path`, `page_title?`          |
| `cta_click`           | Boutons/CTAs (Landing, FAQ, etc.)           | `label`, `location`, `destination?` |
| `navigation_redirect` | Redirections programmatiques (ex. FAQ back) | `from`, `to`, `reason?`             |

### Authentification

| Événement                     | Déclencheur                                | Payload                           |
| ----------------------------- | ------------------------------------------ | --------------------------------- |
| `account_creation_success`    | Inscription email/Google réussie           | `method`, `user_id?`              |
| `account_creation_error`      | Échec inscription email/Google             | `method`, `error_message?`        |
| `login_success`               | Connexion email ou Google                  | `method`, `user_id?`              |
| `login_error`                 | Échec connexion email/Google               | `method`, `error_message?`        |
| `forgot_password_request`     | Soumission mot de passe oublié             | `status`, `error_message?`        |
| `reset_password_submit`       | Réinitialisation de mot de passe           | `status`, `error_message?`        |
| `account_verification_view`   | Affichage `VerifyPage`                     | `token_present`, `source?`        |
| `account_verification_result` | Résultat vérification                      | `status`, `error_message?`        |
| `guard_redirect`              | `ProtectedRoute`, `ProfileCompletionGuard` | `guard`, `destination`, `reason?` |

### Profil & paramètres utilisateur

| Événement                 | Déclencheur                   | Payload                                     |
| ------------------------- | ----------------------------- | ------------------------------------------- |
| `profile_personal_saved`  | Formulaire infos personnelles | `status`, `error_message?`                  |
| `profile_address_saved`   | Formulaire adresse            | `status`, `error_message?`                  |
| `profile_password_change` | Changement de mot de passe    | `status`, `error_message?`                  |
| `profile_avatar_upload`   | Upload avatar                 | `status`, `file_size_kb?`, `error_message?` |

### Crédits & paiements

| Événement                     | Déclencheur                       | Payload                                                                |
| ----------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| `credit_balance_status`       | (Re)rendu `CreditPage` avec solde | `balance`, `status` (`low`\|`ok`\|`critical`), `threshold`             |
| `credit_history_view`         | Ouverture historique crédits      | `source` (`button`\|`auto`)                                            |
| `credit_transactions_refresh` | Requêtes de transactions          | `source` (`manual`\|`auto`)                                            |
| `credit_payment_error`        | Échec checkout Stripe             | `pack_id?`, `error_message?`                                           |
| `credit_pack_checkout`        | Sélection d’un pack               | `pack_id`, `pack_name`, `credit_amount`, `price_eur`                   |
| `credit_pack_purchase`        | Retour Stripe (succès/erreur)     | `pack_id`, `pack_name`, `credit_amount`, `price_eur`, `payment_status` |

### Comparateur

| Événement                    | Déclencheur                                  | Payload                                   |
| ---------------------------- | -------------------------------------------- | ----------------------------------------- |
| `comparateur_step_change`    | Mutation `currentStep` (`ComparateurModule`) | `from`, `to`, `category?`                 |
| `comparateur_form_submit`    | Soumission formulaire                        | `category?`, `status`, `error_message?`   |
| `comparateur_results_loaded` | Réception résultats API                      | `session_id`, `offers_count`, `category?` |
| `comparateur_filter_change`  | Filtres (prix, note, assureur, reset)        | `filter`, `value`                         |
| `comparateur_ai_question`    | Question IA (hero/results)                   | `session_id?`, `has_response`             |

### Chat

| Événement            | Déclencheur                  | Payload                                              |
| -------------------- | ---------------------------- | ---------------------------------------------------- |
| `chat_created`       | Création d’un chat           | `chat_id`, `has_contracts`, `contracts_count`        |
| `chat_selected`      | Sélection d’un chat listé    | `chat_id`                                            |
| `chat_renamed`       | Renommage d’un chat          | `chat_id`                                            |
| `chat_deleted`       | Suppression de chat          | `chat_id`, `status` (`confirm`\|`success`\|`cancel`) |
| `chat_message_sent`  | Message texte utilisateur    | `chat_id`, `message_length`                          |
| `chat_message_error` | Erreur envoi / action rapide | `chat_id?`, `error_message?`                         |
| `chat_quick_action`  | Sélection action rapide      | `chat_id`, `action_label`                            |
| `chat_search`        | Recherche dans la sidebar    | `query_length`                                       |

### Contrats

| Événement                | Déclencheur                             | Payload                                                  |
| ------------------------ | --------------------------------------- | -------------------------------------------------------- |
| `contract_search`        | Barre de recherche contrats             | `query_length`                                           |
| `contract_filter_change` | Filtre catégorie                        | `filter`, `value`                                        |
| `contract_sort_change`   | Tri liste contrats                      | `sort_by`, `sort_order` (`asc`\|`desc`)                  |
| `contract_create_submit` | Upload contrat (`CreateContractModal`)  | `method` (`upload`), `status`, `error_message?`          |
| `contract_edit_save`     | Sauvegarde via `EditContractModal`      | `contract_id`, `status`, `error_message?`                |
| `contract_delete`        | Suppression contrat (`ContractsModule`) | `contract_id`, `status` (`confirm`\|`success`\|`cancel`) |

## Points d’instrumentation (principaux)

- **Initialisation**
  - `src/main.tsx` : `GtmProvider`
  - `src/App.tsx` : `RouteTracker`
- **Auth**
  - `components/SignupForm.tsx`, `LoginForm.tsx`, `ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx`, `VerifyPage.tsx`
  - `components/GoogleCallbackPage.tsx`, `hooks/useGoogleAuth.ts`
  - `components/ProtectedRoute.tsx`, `ProfileCompletionGuard.tsx`
- **Profil**
  - `components/ProfileModule.tsx`
  - `hooks/useAvatarUpload.ts`
- **Crédits**
  - `components/CreditPage.tsx`, `components/TransactionHistoryModal.tsx`
  - `components/PaymentSuccessPage.tsx`
- **Comparateur**
  - `components/ComparateurModule.tsx`
  - `components/comparateur/FormView.tsx`
  - `components/comparateur/ResultsView.tsx`
- **Chat**
  - `components/ChatModule.tsx`
- **Contrats**
  - `components/contracts/ContractsModule.tsx`
  - `components/contracts/CreateContractModal.tsx`
  - `components/contracts/ContractDetails/modals/EditContractModal.tsx`
- **Navigation / CTA**
  - `components/LandingPage.tsx`, `components/landing/Hero/AnimatedHero.tsx`
  - `components/FAQPage.tsx`
- **Général**
  - `services/analytics/gtm.ts` centralise toutes les définitions

## Bonnes pratiques

1. Centraliser tout nouvel événement dans `src/services/analytics/gtm.ts`.
2. Favoriser des valeurs normalisées (`method`, `payment_status`, etc.).
3. Vérifier que `VITE_ENABLE_ANALYTICS` est à `true` sur les environnements cibles avant de tester.
4. Utiliser le débogueur GTM (`?gtm_debug=x`) pour valider la présence des événements.

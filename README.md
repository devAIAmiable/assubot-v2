## 🧠 What is **AssuBot**?

**AssuBot** is a digital platform designed to help individuals better understand, manage, and optimize their insurance coverage. Developed by **À l’amiable**, AssuBot aims to **simplify complex insurance decisions** by combining automation, user-friendly interfaces, and AI.

It provides a modular and extensible architecture, allowing it to support multiple insurance-related services within a unified experience — from contract centralization to intelligent comparison and risk analysis.

---

## 🧩 Key Modules of the Platform

### 1. 📁 **Centralisation des contrats**

> _“Your personal insurance vault”_

- Allows users to **upload, store, and organize their insurance contracts** (auto, home, health, etc.).
- Extracts key data automatically (insurer, coverage, expiration date).
- Enables alerts for contract expiry or renewal opportunities.
- Prepares the ground for comparison or risk analysis modules.

---

### 2. 💬 **Chatbot AssuBot**

> _“A conversational assistant powered by AI”_

- Acts as a 24/7 support channel to answer user questions about insurance.
- Integrates with uploaded contracts and partner data to provide **personalized, contextual responses**.
- Helps users **understand clauses**, **assess coverage gaps**, or **ask for recommendations** in natural language.
- Built on LLM technology (OpenAI / FastAPI) and can evolve into a lead-generation or customer service tool.

---

### 3. 📊 **Dashboard utilisateur**

> _“Your insurance situation at a glance”_

- Visual overview of all contracts, coverage levels, upcoming renewals, and spending.
- KPI tracking for:

  - Number of active contracts
  - Money spent per year
  - Missing or duplicated coverages

- Integration with other modules (ex: suggestions from the comparer or risk module)

---

### 4. 🧠 **Comparateur intelligent (e-Comparateur)**

> _“AI-powered offer comparison that adapts to your needs”_

- Compares existing contracts with market offers **not just by price**, but by **coverage depth, exclusions, service levels, etc.**
- Supports:

  - Pre-filled forms based on existing contracts
  - Manual comparisons for new users
  - Natural language questions (e.g. _“Am I covered for theft abroad?”_)

- Generates **semantic summaries** and visual differences.
- Integrates with insurers’ APIs for real-time quotes and contract analysis.

---

### 5. 📣 **Centre de notifications**

> _“Don’t miss any important event”_

- Sends **smart alerts** to users:

  - Contract expiration
  - Better offers available
  - Risk exposure detected

- Admins can configure types of notifications, frequency, and channels (email, in-app, SMS).

---

### 6. 👤 **Profil utilisateur**

> _“Personal insurance preferences and history”_

- Stores:

  - Personal info
  - Insurance history
  - Preferences and past interactions

- Enables personalized experience across all modules.

---

## 🚀 Roadmap Possibilities

Future modules may include:

- **e-Risk**: Personalized risk scoring and advice
- **e-Souscription**: Direct policy subscription or switching
- **Analytics & Insights** for insurers
- **Open API** for brokers or B2B clients

### Implementation details

- The platform is built with Vite, React, Redux, and Tailwind CSS
- There's no backend yet, but it's planned to be built with FastAPI
- Use redux to persist the state of the app
- Use a fake backend for the time being with mocked data
- The app should be in french
- The primary color is #1e51ab and should always be used as the main color for the app
- Every UI should be animated where possible with framer motion
- Add spaces for illustrations and images where necessary, and use them to make the app more engaging
#!/bin/bash

# Script de développement AssuBot - Frontend uniquement

set -e

echo "🚀 Lancement de AssuBot Frontend en mode développement..."

# Vérifier que Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution !"
    echo "📝 Veuillez démarrer Docker et réessayer"
    exit 1
fi

# Vérifier que le fichier .env.dev existe
if [ ! -f .env.dev ]; then
    echo "⚠️  Fichier .env.dev manquant !"
    if [ -f ".env.example" ]; then
        echo "📝 Création du fichier .env.dev à partir de .env.example..."
        cp .env.example .env.dev
        echo "✅ Fichier .env.dev créé"
        echo "⚠️  Veuillez vérifier et mettre à jour le fichier .env.dev avec votre configuration"
    else
        echo "❌ Fichier .env.example non trouvé !"
        echo "📝 Veuillez créer un fichier .env.dev manuellement"
        exit 1
    fi
fi

# Fonction pour nettoyer
cleanup() {
    echo ""
    echo "🧹 Arrêt des services..."
    docker compose -f docker-compose.dev.yml down
    echo "✅ Services arrêtés"
}

# Trap pour nettoyer à la sortie
trap cleanup EXIT

# Nettoyer les containers existants
echo "🧹 Nettoyage des containers existants..."
docker compose -f docker-compose.dev.yml down --remove-orphans > /dev/null 2>&1 || true

# Lancer le service frontend
echo "🐳 Démarrage du container frontend..."
docker compose -f docker-compose.dev.yml up --build

echo ""
echo "✅ Frontend lancé avec succès !"
echo "   🌐 AssuBot: http://localhost:5173"
echo ""
echo "🔥 Hot reload activé - vos changements seront automatiquement pris en compte"
echo "⏹️  Appuyez sur Ctrl+C pour arrêter le service" 
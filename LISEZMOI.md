# Carnet d'entraînement (version 2.0)

Appli web perso de suivi sportif. Fichiers :

- `index.html` : toute l'appli (HTML + CSS + JavaScript, commenté)
- `sw.js` : garde l'appli en cache pour qu'elle s'ouvre sans réseau
- `manifest.webmanifest` + `icon-*.png` : pour l'installer sur l'écran d'accueil

## 1. Mettre l'appli en ligne (GitHub Pages, gratuit)

1. Sur github.com : **New repository** → nom `carnet` → Create repository.
2. Clique sur **uploading an existing file**, glisse tous les fichiers du dossier (pas le dossier lui-même), puis **Commit changes**.
3. **Settings → Pages** → Source : *Deploy from a branch* → Branch : `main` / `(root)` → **Save**.
4. Après 1 ou 2 minutes, l'appli est sur `https://TON-PSEUDO.github.io/carnet/`.

Le code est visible si le dépôt est public, mais tes données, elles, ne sont jamais dans le dépôt.

Pour mettre à jour l'appli plus tard : réimporte le nouveau `index.html` dans le dépôt (même nom de fichier, il remplace l'ancien).

## 2. L'installer sur le téléphone

- **iPhone (Safari)** : ouvre le lien → bouton Partager → **Sur l'écran d'accueil**.
- **Android (Chrome)** : ouvre le lien → menu ⋮ → **Installer l'application** (ou « Ajouter à l'écran d'accueil »).

À ce stade, l'appli marche déjà, mais les données restent sur chaque appareil.

## 3. Synchroniser téléphone + ordi (Firebase, gratuit, facultatif)

1. Va sur https://console.firebase.google.com → **Ajouter un projet** (ou « Créer un projet ») → nom `carnet-entrainement` → désactive Google Analytics → Créer.
2. **Authentication** → Commencer → onglet **Sign-in method** → **Adresse e-mail/Mot de passe** → Activer → Enregistrer.
3. **Firestore Database** → Créer une base de données → emplacement `europe-west9 (Paris)` → **mode production** → Créer.
4. Toujours dans Firestore, onglet **Règles** : remplace tout par ce bloc, puis **Publier** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

5. Roue dentée → **Paramètres du projet** → en bas, « Vos applications » → icône **Web `</>`** → surnom `carnet` → Enregistrer l'application (pas besoin de Firebase Hosting). Copie le bloc `const firebaseConfig = { ... };`.
6. Dans l'appli : **Plus → Configurer Firebase** → colle le bloc → Enregistrer → **Créer mon compte** (ton e-mail + un mot de passe).
7. Sur l'autre appareil : ouvre l'appli, **Plus → Configurer Firebase** (même bloc), puis **Se connecter** avec le même e-mail et le même mot de passe.

Facultatif, mais recommandé une fois ton compte créé : dans Authentication → **Paramètres** → « Actions des utilisateurs », décoche la création de compte (inscription). Personne d'autre ne pourra alors créer de compte sur ton projet.

La clé `apiKey` n'est pas un secret : c'est un identifiant public de ton projet. Ce qui protège tes données, ce sont les règles de l'étape 4 : chaque compte ne peut lire et écrire que son propre dossier.

## Bon à savoir

- Ce que tu notes avant de te connecter est fusionné dans ta base à la première connexion.
- Sans réseau, tout reste noté sur le téléphone et part dès que le réseau revient.
- Le plan gratuit de Firebase est très largement suffisant pour un usage perso.
- Garde quand même l'habitude d'exporter (Plus → Exporter) de temps en temps.
- Pour récupérer des données saisies dans la version Claude : là-bas, Plus → Exporter, puis ici, Plus → Importer.

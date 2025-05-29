# Application d'Entraînement à la Dactylographie

L'Application d'Entraînement à la Dactylographie est une application web construite avec React.js qui permet aux utilisateurs de pratiquer et d'améliorer leurs compétences en dactylographie. Cette application offre une interface simple et intuitive pour que les utilisateurs puissent tester leur vitesse et leur précision de frappe.

## Pour Commencer

### Prérequis

Pour exécuter l'Application d'Entraînement à la Dactylographie localement, vous devez avoir PNPM installé. Si PNPM n'est pas déjà installé sur votre système, vous pouvez l'installer en suivant les instructions sur [https://pnpm.io/fr/installation](https://pnpm.io/fr/installation).

### Installation

Suivez ces étapes pour mettre l'application en marche sur votre machine locale :

1. Clonez le dépôt :
git clone https://github.com/ashsajal1/typing-app.git

2. Accédez au répertoire du projet :
cd typing-app

3. Installez les dépendances en utilisant PNPM :
pnpm install

4. Démarrez le serveur de développement :
pnpm dev

5. Ouvrez votre navigateur et visitez `http://localhost:3000` pour accéder à l'Application d'Entraînement à la Dactylographie.

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez suivre ces étapes :

1. Forkez le dépôt en cliquant sur le bouton "Fork" sur la page du dépôt GitHub.

2. Clonez votre dépôt forké sur votre machine locale :
git clone https://github.com/votre-nom-utilisateur/typing-app.git

3. Créez une nouvelle branche pour votre fonctionnalité ou correction de bug :
git checkout -b feature/nom-de-votre-fonctionnalite

4. Faites vos modifications et ajoutez-les à votre branche.

5. Validez vos modifications :
git commit -m "Ajoutez votre message de commit ici"

6. Poussez vos modifications vers votre dépôt forké :
git push origin feature/nom-de-votre-fonctionnalite

7. Ouvrez une pull request sur la page GitHub du dépôt principal. Fournissez une description claire de vos modifications et de leur objectif.

Veuillez vous assurer que votre code respecte le style de code et les directives établis. Assurez-vous également de tester vos modifications minutieusement avant de soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Vous êtes libre d'utiliser, de modifier et de distribuer le code conformément aux termes de la licence.

N'hésitez pas à explorer le code, à apporter des améliorations et à contribuer à l'Application d'Entraînement à la Dactylographie. Nous apprécions vos contributions !

## Tests

Ce projet utilise Playwright pour les tests de bout en bout (end-to-end).

### Prérequis pour les Tests

Assurez-vous d'avoir déjà suivi les étapes d'installation principales et de pouvoir exécuter l'application localement en utilisant `pnpm dev`.

### Configuration de Playwright

1.  **Installer les navigateurs Playwright :**
    Après l'installation initiale avec `pnpm install`, vous devez installer les navigateurs utilisés par Playwright :
    ```bash
    pnpm playwright install --with-deps
    ```
    Cette commande télécharge les binaires des navigateurs nécessaires (Chromium, Firefox, WebKit) ainsi que leurs dépendances.

### Exécution des Tests

1.  **Démarrer le serveur de développement (s'il n'est pas déjà en cours d'exécution) :**
    Dans un terminal, exécutez :
    ```bash
    pnpm dev
    ```
    Playwright est configuré pour utiliser ce serveur (à l'adresse `http://localhost:5173`).

2.  **Exécuter la suite de tests Playwright :**
    Dans un autre terminal, exécutez la commande suivante :
    ```bash
    pnpm test:e2e
    ```
    Cela exécutera tous les tests définis dans le répertoire `tests/`.

### Affichage des Rapports de Test

Une fois les tests terminés, un rapport HTML sera disponible. Vous pouvez le consulter en exécutant :

```bash
pnpm playwright show-report
```
Cette commande ouvrira le rapport dans votre navigateur web, vous permettant de voir les résultats détaillés pour chaque test.

**Note :** Les tests de bout en bout peuvent être gourmands en ressources et prendre un certain temps à s'exécuter.

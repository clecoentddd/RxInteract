# **App Name**: RxInteract

## Core Features:

- Sélection des médicaments: Permet aux utilisateurs de sélectionner deux médicaments dans une liste pour vérifier les interactions.
- Affichage des interactions: Affiche une liste des interactions entre deux médicaments en fonction des données extraites du magasin d'événements.
- Recherche de médicaments: Rechercher et ajouter des médicaments au système via un formulaire (les données sont stockées sous forme d'événements DrugAdded).
- Gestion des interactions: Les utilisateurs authentifiés peuvent ajouter, mettre à jour ou supprimer des interactions médicamenteuses. Toutes les modifications sont enregistrées en tant que nouveaux événements.
- Authentification de l'utilisateur: Système d'authentification simulé pour permettre l'administration du système. Ce système écrit une tranche Authentifiée dans le magasin. La connexion n'est pas requise pour la recherche d'interactions.
- Projections en direct: Event sourcing pour récupérer les données ; les listes de médicaments et d'interactions sont toujours à jour en fonction des événements actuels.

## Style Guidelines:

- Couleur primaire : Violet foncé (#673AB7) pour représenter l'expertise médicale et le sérieux.
- Couleur de fond : Gris très clair (#F5F5F5), offrant une toile de fond propre et professionnelle.
- Couleur d'accent : Sarcelle (#009688) utilisée avec parcimonie pour les actions et les points forts clés, donnant un sentiment de confiance.
- Police du corps et des titres : 'Inter', une police sans serif pour une lisibilité propre et moderne.
- Police de code : 'Source Code Pro' pour afficher des extraits de code.
- Utiliser des icônes claires et minimales d'un ensemble cohérent (par exemple, les icônes de Material Design) pour les interactions et la navigation.
- Mettre l'accent sur une hiérarchie claire en mettant l'accent sur le contenu. Utiliser efficacement l'espacement et le contraste.
- Animations subtiles sur la sélection des médicaments et les interactions de recherche.
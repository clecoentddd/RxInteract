Vertical Slice Architecture et Event Sourcing

Application de Event Modeling

Une slice = un folder

State change slice
- Command.js: la commande
- CommandHandler,js: le commandHandler
    - Replay (events qui sont utiles)
    - Apply business rules
    - Append Event (en accordance de event.js)
- Event.js: le format de l'event a son propre fichier

State View slice - projection
- Live projection: rejoue les events
- ListeDesMedicaments
- ListeDesInteractions
- etc 

AjouterUnMedicament
    - MedicamentAjoutée
MettreAJourUnMedicament
    - MedicamentMiseAJour
AjouterUneInteraction
    - ne doit pas déjà existée
    - event InteractionAjoutée
MettreAJourUneInteraction
    - ne pas mettre à jour que description, reco et reco_details
    - event InteractionMiseAJour
SupprimerUneInteraction
    - Suppression via event InteractionSupprimée
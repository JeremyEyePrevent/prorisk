# ProRisk — Site vitrine

Site vitrine statique pour **ProRisk**, cabinet de conseil spécialisé dans le management des risques professionnels et la rédaction du DUERP.

## Stack technique

- HTML5 sémantique
- CSS vanilla (variables CSS, mobile-first)
- JavaScript vanilla (aucune dépendance)
- Déploiement : GitHub Pages (branche `main`)

## Structure du projet

```
prorisk/
├── index.html          # Page principale (toutes les sections)
├── css/
│   └── style.css       # Styles avec variables CSS dans :root
├── js/
│   └── main.js         # Scripts : nav, animations, formulaire
├── images/
│   └── .gitkeep        # Dossier pour les images (à remplir)
└── README.md
```

## Sections

| Ancre           | Description                              |
|-----------------|------------------------------------------|
| `#hero`         | Accroche principale + chiffres clés      |
| `#apropos`      | Présentation de ProRisk et ses valeurs   |
| `#services`     | 6 prestations détaillées (cartes)        |
| `#temoignages`  | 3 avis clients                           |
| `#galerie`      | Grille de photos d'interventions         |
| `#contact`      | Formulaire + coordonnées                 |

## Mise en route

1. Cloner ou télécharger le dossier
2. Ouvrir `index.html` dans un navigateur (ou via Live Server dans VS Code)
3. Configurer le formulaire de contact (voir ci-dessous)

## Configuration du formulaire de contact

Le formulaire utilise [Formspree](https://formspree.io) (service gratuit, sans backend).

1. Créer un compte sur [formspree.io](https://formspree.io)
2. Créer un nouveau formulaire → copier l'ID fourni
3. Dans `index.html`, remplacer `VOTRE_ID_FORMSPREE` :

```html
<!-- Ligne ~134 dans index.html -->
action="https://formspree.io/f/VOTRE_ID_FORMSPREE"
```

## Ajout des images

Déposez vos photos dans le dossier `images/` puis référencez-les dans `index.html`.

Pour la galerie, remplacez les `<div class="galerie__img galerie__img--N">` par des balises `<img>` :

```html
<img src="images/audit-entrepot.jpg" alt="Audit de sécurité en entrepôt logistique" />
```

## Déploiement sur GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit — ProRisk site vitrine"
git remote add origin https://github.com/VOTRE_USER/prorisk.git
git push -u origin main
```

Puis dans les **Settings** du dépôt → **Pages** → Source : branche `main`, dossier `/ (root)`.

## Personnalisation

Toutes les couleurs, typographies et espacements sont définis dans les variables CSS au début de `css/style.css` (bloc `:root`). Modifier ces valeurs suffit pour adapter la charte graphique.

```css
:root {
  --color-primary:   #1a2744;  /* Navy — couleur principale */
  --color-secondary: #2563eb;  /* Bleu — liens et accents */
  --color-accent:    #f59e0b;  /* Ambre — boutons CTA */
  /* … */
}
```

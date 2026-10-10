# dgotix.com

The DGOTIX welcome page, served by GitHub Pages at https://dgotix.com/.
A static, bilingual (Arabic / English) page with no build step.

- `index.html` — the page (styles and scripts inline; fonts in `fonts/`).
- `smartbudget/` — `dgotix.com/smartbudget` sends visitors to https://smartbudget.dgotix.com/.
- `CNAME` — the custom domain for GitHub Pages.

## Adding a product

1. Copy the SmartBudget `<article class="product">` block in `index.html`, change the
   name, icon, description, features and link (keep both `data-ar` and `data-en` texts).
2. Optionally add a short link folder like `smartbudget/` that redirects to it.
3. Add its address to `sitemap.xml` if it lives on dgotix.com.

The figures in the analytics chart are illustrative (demo account) and are labelled so on the page.

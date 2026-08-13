# Heavenly Paws — live site

Ten pages, fully wired (Square, Printify, Formspree, Substack, Luma).
Static site: no build step. Deploy the contents of this folder as-is.

Pages: index (Pet Club) · services · treats · newsletter ·
join-online · join-partner · join-madison-free ·
wags · guardian-angels · guardian-thank-you · paws-for-a-purpose

Everything is wired: donation checkouts (app.js), and both WAGS-page
forms submit to Formspree form mkodnogy (shared with Pet Club contact),
tagged via _subject + form_source so you can tell submissions apart.
In Square, set each donation link's "Redirect to a website after
checkout" to /guardian-thank-you so donors land on the thank-you page.

Deploy: push this folder to GitHub, import the repo on vercel.com,
framework preset "Other", no build command. vercel.json enables clean
URLs (e.g. /newsletter works as well as /newsletter.html).

Editing later: text lives in the .html files; colors/design in
styles.css; all third-party links in one block at the top of app.js.

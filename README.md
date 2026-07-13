# Heavenly Paws — live site

Seven pages, fully wired (Square, Printify, Formspree, Substack, Luma).
Static site: no build step. Deploy the contents of this folder as-is.

Pages: index (Pet Club) · services · treats · newsletter ·
join-online · join-partner · join-madison-free

Deploy: push this folder to GitHub, import the repo on vercel.com,
framework preset "Other", no build command. vercel.json enables clean
URLs (e.g. /newsletter works as well as /newsletter.html).

Editing later: text lives in the .html files; colors/design in
styles.css; all third-party links in one block at the top of app.js.

# Publishing this profile README

These two files belong in the repo named after your username:
**`rishav-dev/rishav-dev`**. GitHub renders that repo's README on your profile
page. It is not the same repo as your website.

That repo is not cloned on your machine, so:

```powershell
cd C:\Users\Rishav\Documents\GitHub
git clone https://github.com/rishav-dev/rishav-dev.git
```

Then copy `README.md` and `assets/banner.png` from this folder over the ones in
the clone, overwriting both. The old `assets/banner.svg` can be deleted; nothing
references it any more.

```powershell
cd rishav-dev
git add -A
git commit -m "Rebuild profile to match the new site"
git push origin main
```

Refresh github.com/rishav-dev and it is live.

## What changed and why

- **New banner**, rendered from the same fonts and palette as the site, so the
  profile and rishavchakravarty.com look like one thing.
- **Removed every claim you cannot click through and check.** Gone: the 93%
  face recognition figure, the 20,000+ ReCell devices, and the coursework
  metrics. Those projects are still listed, under a heading that says plainly
  there is no public repository for them.
- **Fixed the awards.** "KickStart VT Seed Grant" is not what the CalendAI
  cheque says; it says Apex Center for Entrepreneurs, $500. "Future Founder
  Startup Award" is the Trendify AI Minute Pitch win, $300. Both corrected, and
  Kinjal is credited on all three, because you won all three together.
- **Fixed the MentalHealthResearch description.** It said the project was about
  social-media behaviour signals tracking self-reported outcomes. It is a Reddit
  sentiment and classifier study. The real numbers are now in a table.
- **Removed the profile-view counter and the typing banner.** Both are
  third-party services that spend a lot of their time rate-limited and render as
  broken images.
- **No em dashes**, and the same first-person voice as the site.

The contribution activity graph is the one dynamic image left. If it ever shows
as broken, that service is rate-limited; delete the block at the bottom.

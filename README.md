# cypherpunk society (`cypherpunksociety.org`)

Open-source digital self-defense, privacy tools, and freedom bandwidth — started at **Frontier Tower, San Francisco** (995 Market St, San Francisco, CA 94103).

- **Live Website:** [https://cypherpunksociety.org](https://cypherpunksociety.org)
- **Awesome Cypherpunk Resource List:** [https://github.com/CypherpunkSociety/awesome-cypherpunk](https://github.com/CypherpunkSociety/awesome-cypherpunk)
- **Docs & Curriculum:** [https://cypherpunksociety.org/docs.html](https://cypherpunksociety.org/docs.html)
- **How to Clone Us:** [https://cypherpunksociety.org/start.html](https://cypherpunksociety.org/start.html)
- **Contact:** `contact@cypherpunksociety.org`

## What We Do

- **Surveillance Self-Defense & Freedom OS:** Monthly hands-on clinics (6:30 PM / 18:30) walking through [EFF's Surveillance Self-Defense](https://ssd.eff.org/), [Tails OS](https://tails.net/) USB verification & flashing, [Qubes OS](https://www.qubes-os.org/), and [GrapheneOS](https://grapheneos.org/).
- **Threat Intelligence & Cognitive Security:** Dissecting commercial spyware disclosures from [The Citizen Lab (UofT)](https://citizenlab.ca/) and collaborating with the [Stanford Cognitive Security Task Force](https://hai.stanford.edu/) on AI persuasion, information integrity, and neurotech/BCI privacy.
- **Open-Source Intelligence (OSINT) & Investigative Data:** Tracking [Bellingcat](https://www.bellingcat.com/) investigative toolkits, cross-border public-interest reporting from [OCCRP](https://www.occrp.org/), and [ProPublica](https://www.propublica.org/) open-source data tools ([Nonprofit Explorer](https://projects.propublica.org/nonprofits/), [github.com/propublica](https://github.com/propublica), and [ProPublica Events](https://www.propublica.org/events)).
- **Hacker Pedagogy & Open Web Spirit:** Screening [Chaos Computer Club (CCC)](https://media.ccc.de/) lectures and running participatory sessions in the spirit of [MozFest](https://www.mozillafoundation.org/en/festival/), [Aaron Swartz Day](https://www.aaronswartzday.org/) (with [SecureDrop](https://securedrop.org/) & the [Internet Archive](https://archive.org/)), the [RSA Conference](https://www.rsaconference.com/) city-wide key-signing party, and the [DEF CON Biohacking Village](https://www.defconbiohackingvillage.org/).
- **Public-Interest Bandwidth:** Operating and advocating for [Tor](https://www.torproject.org/) Snowflake proxies, obfs4 bridges, and non-profit relay partnerships ([Emerald Onion](https://emeraldonion.org/) & [Nos Oignons](https://nos-oignons.net/)).

## Add Your Chapter to the Map

To add a new Cypherpunk Society node to the map on [cypherpunksociety.org](https://cypherpunksociety.org):

1. Fork this repository and follow the node guide in [`public/start.html`](public/start.html).
2. Add your chapter's `{ name, lat, lon }` entry to the `nodes` list in [`public/index.html`](public/index.html).
3. Open a pull request.

## Development & Deployment (Cloudflare `cf` CLI)

```bash
npm install
npm run dev      # Start local dev server (cf dev)
npm run deploy   # Deploy to Cloudflare Workers (cf deploy)
```

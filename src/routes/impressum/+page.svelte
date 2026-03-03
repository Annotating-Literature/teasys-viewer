<script lang="ts">
    import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
</script>

<svelte:head>
    <title>Colophon / Impressum — TEASys Viewer</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-12 md:py-16">
    <Breadcrumbs
        crumbs={[{ label: "Library", href: "/" }, { label: "Colophon" }]}
    />

    <h1
        class="text-4xl font-bold tracking-tight text-stone-900 font-serif leading-tight mb-2"
    >
        Colophon
    </h1>
    <div class="w-12 h-[2px] bg-primary-300 rounded-full mt-4 mb-10"></div>

    <div class="space-y-8">
        <section>
            <h2 class="text-xl font-semibold text-stone-800 font-serif mb-3">
                Postal Address
            </h2>
            <p class="text-stone-600 leading-relaxed">
                Prof. Dr. Matthias Bauer<br />
                Englisches Seminar<br />
                Eberhard-Karls Universitaet Tuebingen<br />
                Wilhelmstr. 50<br />
                72074 Tuebingen<br />
                Germany
            </p>
        </section>

        <section>
            <h2 class="text-xl font-semibold text-stone-800 font-serif mb-3">
                Contact
            </h2>
            <p class="text-stone-600 leading-relaxed">
                Electronic contact: <a
                    href="mailto:admin@annotating-literature.org"
                    class="text-primary-600 hover:text-primary-700 underline"
                    >admin@annotating-literature.org</a
                >
            </p>
        </section>

        <section>
            <h2 class="text-xl font-semibold text-stone-800 font-serif mb-3">
                Credit
            </h2>
            <p class="text-stone-600 leading-relaxed">
                Online Editing: Timo Stösser<br />
                Coding of the alpha bookviewer:
                <a
                    href="https://pekka.co"
                    class="text-primary-600 hover:text-primary-700 underline"
                    >Pekka Gaiser</a
                ><br />
                Coding of the TEASys Viewer V1: Christian Beuter<br />
                Coding of the TEASys Viewer V2: Victor Künstler<br />
                Coding of the TEASys Viewer V3:
                <a
                    href="https://blog.nicolai.ink"
                    class="text-primary-600 hover:text-primary-700 underline"
                    >Nicolai Plenk</a
                >
            </p>
            <p class="text-stone-600 leading-relaxed mt-3">
                All articles are written by participants of the "Annotating
                Literature" project (unless stated otherwise). Copyright holder
                is the chair of Prof. Matthias Bauer at the Eberhard Karls
                University Tuebingen which the project is a part of.
            </p>
            <p class="text-stone-600 leading-relaxed mt-3">
                Our web sites contain reference (links) to third-party web
                sites. We have no influence on their contents. The respective
                provider or operator is always responsible for the contents of
                the linked sites. The linked sites were carefully examined at
                the time of linking. Illegal contents were apparently not
                recognizable at this time.
            </p>
        </section>
    </div>

    <!-- German section -->
    <div class="mt-16 pt-12 border-t border-stone-200/60">
        <h1
            class="text-4xl font-bold tracking-tight text-stone-900 font-serif leading-tight mb-2"
        >
            Deutsches Impressum
        </h1>
        <div class="w-12 h-[2px] bg-primary-300 rounded-full mt-4 mb-10"></div>

        <div class="space-y-8">
            <section>
                <h2
                    class="text-xl font-semibold text-stone-800 font-serif mb-3"
                >
                    Postalische Adresse
                </h2>
                <p class="text-stone-600 leading-relaxed">
                    Prof. Dr. Matthias Bauer<br />
                    Englisches Seminar<br />
                    Eberhard-Karls Universität Tübingen<br />
                    Wilhelmstr. 50<br />
                    72074 Tübingen<br />
                    Deutschland
                </p>
            </section>

            <section>
                <h2
                    class="text-xl font-semibold text-stone-800 font-serif mb-3"
                >
                    Kontakt
                </h2>
                <p class="text-stone-600 leading-relaxed">
                    Elektronischer Kontakt über: <a
                        href="mailto:admin@annotating-literature.org"
                        class="text-primary-600 hover:text-primary-700 underline"
                        >admin@annotating-literature.org</a
                    >
                </p>
            </section>

            <section>
                <h2
                    class="text-xl font-semibold text-stone-800 font-serif mb-3"
                >
                    Credit
                </h2>
                <p class="text-stone-600 leading-relaxed">
                    Online-Redaktion: Timo Stösser<br />
                    Programmierung des Alpha-Text-Viewers:
                    <a
                        href="https://pekka.cio"
                        class="text-primary-600 hover:text-primary-700 underline"
                        >Pekka Gaiser</a
                    ><br />
                    Programmierung des TEASys-Viewer V1: Christian Beuter<br />
                    Programmierung des TEASys-Viewer V2: Victor Künstler<br />
                    Programmierung des TEASys-Viewer V3:
                    <a
                        href="https://blog.nicolai.ink"
                        class="text-primary-600 hover:text-primary-700 underline"
                        >Nicolai Plenk</a
                    >
                </p>
                <p class="text-stone-600 leading-relaxed mt-3">
                    Alle Texte sind (sofern nicht anders ausgewiesen) von
                    Mitgliedern des Projektes erstellt. Das Copyright liegt am
                    Lehrstuhl Matthias Bauer (Universität Tübingen), zu dem das
                    Projekt &ldquo;Annotating-Literature&rdquo; gehört.
                </p>
                <p class="text-stone-600 leading-relaxed mt-3">
                    &ldquo;Annotating Literature&rdquo; ist nicht für den Inhalt
                    externer Links verantwortlich. Mit Urteil vom 12. Mai 1998
                    hat das Landgericht Hamburg entschieden, dass man durch die
                    Ausbringung eines Links die Inhalte der gelinkten Seite ggf.
                    mit zu verantworten hat. Dies kann, so das LG, nur dadurch
                    verhindert werden, dass man sich ausdrücklich von diesen
                    Inhalten distanziert. Für alle Links von dieser Website auf
                    andere Seiten im Internet gilt: Wir erklären ausdrücklich,
                    keinerlei Einfluss auf die Gestaltung und die Inhalte der
                    gelinkten Seiten haben. Deshalb distanziert sich das Projekt
                    hiermit ausdrücklich von allen Inhalten aller gelinkten
                    Seiten auf der Homepage. Wir machen uns deren Inhalte NICHT
                    zu eigen. Diese Erklärung gilt für alle auf dieser Homepage
                    angezeigten Links und für alle Inhalte der Seiten, zu denen
                    die bei mir sichtbaren Banner, Buttons und Links führen.
                </p>
            </section>
        </div>
    </div>
</div>

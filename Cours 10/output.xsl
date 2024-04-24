<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title><xsl:value-of select="section/@title"/></title>

            <script src="input-range/input-range.js"></script>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.2.0/svg.min.js" integrity="sha512-EmfT33UCuNEdtd9zuhgQClh7gidfPpkp93WO8GEfAP3cLD++UM1AG9jsTUitCI9DH5nF72XaFePME92r767dHA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"></link>
            <script defer="True" src="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js"></script>
            <script defer="True" src="https://cdn.jsdelivr.net/npm/katex/dist/contrib/auto-render.min.js"
            ></script>
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    renderMathInElement(document.body, {
                        delimiters: [
                            {left: '$$', right: '$$', display: true},
                            {left: '$', right: '$', display: false},
                        ],
                        throwOnError : false
                    });
                    hljs.highlightAll();
                });
            </script>

            <!-- REVEAL -->
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.min.css"></link>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/theme/black.css"></link>
			<script src="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.min.js"></script>

            <!-- HIGHLIGHT -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"></link>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/matlab.min.js"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/a11y-dark.css" integrity="sha512-d/XggqGycQ04tWRYDW0iD5E/1WjEpvg+9iUvVKHkq/eUuwtGAB+5Rl3cSuSL1znHXTRMr6g1w22jVu4yNvK2xQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />

            <link rel="stylesheet" href="style.css"/>

            <!-- <link rel="stylesheet" href="https://unpkg.com/latex.css/style.min.css" /> -->
        </head>
        <body>
            <div class="reveal">
                <div class="slides">
                    <xsl:apply-templates/>
                </div>
            </div>

            <script>
				Reveal.initialize({
					hash: true,
                    width: 1920,
                    height: 1280,
                    <!-- minScale: 1,
                    maxScale: 1.0 -->
                    <!-- height: 100vh, -->
                    <!-- height: 720, -->
				})
			</script>
        </body>
        </html>
    </xsl:template>

    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>


    <xsl:template match="section">
        <section>
            <h1><xsl:value-of select="./@title"/></h1>
            <xsl:apply-templates select="node() except section"/>
        </section>
        <xsl:apply-templates select="section"/>
    </xsl:template>

    <xsl:template match="section/section">
        <section>
            <h2><xsl:value-of select="./@title"/></h2>
            <xsl:apply-templates select="node() except section"/>
        </section>
        <xsl:apply-templates select="section"/>
    </xsl:template>

	<xsl:template match="section/section/section">
        <section>
            <h3><xsl:value-of select="./@title"/></h3>
            <xsl:apply-templates/>
        </section>
    </xsl:template>

    <xsl:template match="section/section/section/section">
        <section>
            <h4><xsl:value-of select="./@title"/></h4>
            <xsl:apply-templates/>
        </section>
    </xsl:template>

</xsl:stylesheet>
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!-- <xsl:output method="html" encoding="utf-8" indent="yes" /> -->
	<xsl:output method="html" version="5" encoding="UTF-8" indent="yes" />
    
    <xsl:template match="/">
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Document</title>

            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      
              <!-- KATEX -->
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css" crossorigin="anonymous"></link>
			<script src="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.js" crossorigin="anonymous"></script>
			<script src="https://cdn.jsdelivr.net/npm/katex@latest/dist/contrib/auto-render.min.js" crossorigin="anonymous"></script>

			<!-- REVEAL -->
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.min.css"></link>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/black.css"></link>
			<script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.min.js"></script>
			
			<link rel="stylesheet" href="css/main.css"></link>
        </head>
        <body>
            
			<div class="reveal">
				<div class="slides">
				
					<xsl:apply-templates/>
				
				</div>
			</div>
            

            <script>
                    renderMathInElement(document.body, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "$", right: "$", display: false}
                        ],
						ignoredTags : ["script", "noscript", "style", "textarea", "option"]
                    });
            </script>

			<script>
				Reveal.initialize({
					hash: true,
				})
			</script>

			<!-- PRISM -->
			<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js"></script>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"></link>
			<script>
				Prism.plugins.NormalizeWhitespace.setDefaults({
					'remove-trailing': true,
					'remove-indent': true,
					'left-trim': true,
					'right-trim': true,
				});
			</script>
        </body>
        </html>
    </xsl:template>

	<xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

	<!-- #Section -->
	<xsl:template match="section">
        <section>
            <h1><xsl:value-of select="./@title"/></h1>
        </section>
            <xsl:apply-templates/>
    </xsl:template>

	<!-- #Section -->
	<xsl:template match="section/section">
        <section>
            <h2><xsl:value-of select="./@title"/></h2>
        </section>
            <xsl:apply-templates/>
    </xsl:template>

	<!-- #Section -->
	<xsl:template match="section/section/section">
        <section>
            <h3><xsl:value-of select="./@title"/></h3>
            <xsl:apply-templates/>
        </section>
    </xsl:template>

	<!-- #Section -->
	<xsl:template match="section/section/section/section">
        <section>
            <h4><xsl:value-of select="./@title"/></h4>
            <xsl:apply-templates/>
        </section>
    </xsl:template>

</xsl:stylesheet>
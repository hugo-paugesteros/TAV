pug --pretty -E xml content/index.pug -o .
xslt3 -xsl:output.xsl -s:index.xml -o:output.html
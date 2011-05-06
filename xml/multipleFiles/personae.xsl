<?xml version='1.0'?>
<xsl:stylesheet 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  version="2.0">

<xsl:output method="xml" indent="yes" encoding="ISO-8859-1" omit-xml-declaration="yes" />

<xsl:variable name="newline">
    <xsl:text>
</xsl:text>
</xsl:variable>

<xsl:variable name="newlineTab">
    <xsl:text>
    </xsl:text>
</xsl:variable>

<xsl:template match="/">
    <xsl:result-document method="xml" href="personaeByPlay.xml">
    <PERSONAE>
    <xsl:value-of select="$newline" />
        <xsl:for-each select="filenames/filename">
            <xsl:for-each select="document(concat('shaks200/', .))/PLAY/PERSONAE/PERSONA">
                <xsl:sort select="." />
                <PERSONA>
                    <xsl:attribute name="play">
                        <xsl:value-of select="/PLAY/TITLE" />
                    </xsl:attribute>
                    <xsl:value-of select="." /><br />
                </PERSONA>
                <xsl:value-of select="$newlineTab" />
            </xsl:for-each>
        </xsl:for-each>
    <xsl:value-of select="$newline" />
    </PERSONAE>
    </xsl:result-document>
</xsl:template>



</xsl:stylesheet>
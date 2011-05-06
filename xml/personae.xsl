<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >

<xsl:template match="/">
    <PERSONAE>
    <xsl:for-each select="PLAY/PERSONAE/PERSONA">
        <xsl:sort select="." order="ascending"/>
        <PERSONA>
            <xsl:attribute name="play">
                <xsl:value-of select="/PLAY/TITLE" />
            </xsl:attribute>
            <xsl:value-of select="." />
        </PERSONA>
    </xsl:for-each>
    </PERSONAE>
</xsl:template>

</xsl:stylesheet>

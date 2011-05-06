<?xml version="1.0" encoding="ISO-8859-1"?> 

<xsl:stylesheet version="1.0"
xmlns="http://www.w3.org/1999/xhtml"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 

<xsl:template match="/"> 
    <xsl:for-each select="PLAY/PERSONAE/PERSONA"> 
        <PERSONA>
            <xsl:value-of select="." />
        </PERSONA> 
    </xsl:for-each> 
</xsl:template> 


</xsl:stylesheet>
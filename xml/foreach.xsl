<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >

  <xsl:template match="/">
    <HTML>
      <BODY>
        <TABLE>
          <xsl:for-each select="customers/customer">
            <xsl:sort select="state" order="descending"/>
            <xsl:sort select="name"/>
            <TR>
              <TD><xsl:value-of select="name" /></TD>
              <TD><xsl:value-of select="address" /></TD>
              <TD><xsl:value-of select="phone" /></TD>
            </TR>
          </xsl:for-each>
        </TABLE>
      </BODY>
    </HTML>
  </xsl:template>

</xsl:stylesheet>

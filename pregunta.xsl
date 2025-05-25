<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>Preguntas y Respuestas</title>
                <style>
                    .correcta {
                        background-color: lightgreen; /* Fondo verde para respuestas correctas */
                    }
                    .incorrecta {
                        background-color: lightcoral; /* Fondo rojo para respuestas incorrectas */
                    }
                    table {
                        border-collapse: collapse;
                        margin-bottom: 20px;
                        width: 100%; /* Asegura que la tabla ocupe todo el ancho disponible */
                    }
                    td, th {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: center;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Preguntas y Respuestas</h1>
                <xsl:for-each select="//pregunta">
                    <table>
                        <tr>
                            <th colspan="4"> <xsl:value-of select="enunciado"/>
                            </th>
                        </tr>
                        <tr>
                            <xsl:for-each select="respuesta">
                                <td>
                                    <xsl:attribute name="class">
                                        <xsl:choose>
                                            <xsl:when test="@correcta='sí'">correcta</xsl:when>
                                            <xsl:otherwise>incorrecta</xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:attribute>
                                    <xsl:value-of select="."/>
                                </td>
                            </xsl:for-each>
                        </tr>
                    </table>
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>
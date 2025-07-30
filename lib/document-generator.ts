import crypto from 'crypto'

export interface DocumentContent {
  title: string
  author: string
  institution?: string
  course?: string
  advisor?: string
  date?: string
  abstract?: string
  keywords?: string[]
  sections: DocumentSection[]
  references?: Reference[]
}

export interface DocumentSection {
  title: string
  content: string
  subsections?: DocumentSection[]
}

export interface Reference {
  id: string
  type: 'article' | 'book' | 'inproceedings' | 'misc'
  title: string
  author: string
  year: string
  journal?: string
  publisher?: string
  pages?: string
  url?: string
  doi?: string
}

export class DocumentGenerator {
  generateABNTHTML(content: DocumentContent): string {
    const { title, author, institution, course, advisor, date, abstract, keywords, sections, references } = content

    const sectionsHTML = sections.map(section => this.generateSectionHTML(section)).join('\n')
    const referencesHTML = references ? this.generateReferencesHTML(references) : ''

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @page {
            size: A4;
            margin: 3cm 2cm 2cm 3cm;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            text-align: justify;
            margin: 0;
            padding: 0;
            color: black;
        }
        
        .cover-page {
            page-break-after: always;
            text-align: center;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2cm 0;
        }
        
        .cover-page .institution {
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 0.5cm;
        }
        
        .cover-page .course {
            font-weight: bold;
            font-size: 12pt;
            margin-bottom: 2cm;
        }
        
        .cover-page .author {
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 3cm;
        }
        
        .cover-page .title {
            font-weight: bold;
            font-size: 18pt;
            margin-bottom: 3cm;
            text-transform: uppercase;
        }
        
        .cover-page .advisor {
            text-align: right;
            font-size: 12pt;
            margin-bottom: 2cm;
        }
        
        .cover-page .date {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .abstract-page {
            page-break-before: always;
            page-break-after: always;
        }
        
        .abstract-title {
            font-weight: bold;
            font-size: 12pt;
            text-align: center;
            margin-bottom: 1cm;
            text-transform: uppercase;
        }
        
        .abstract-content {
            text-indent: 0;
            margin-bottom: 1cm;
        }
        
        .keywords {
            font-weight: bold;
        }
        
        .toc {
            page-break-before: always;
            page-break-after: always;
        }
        
        .toc-title {
            font-weight: bold;
            font-size: 12pt;
            text-align: center;
            margin-bottom: 2cm;
            text-transform: uppercase;
        }
        
        .toc-item {
            margin-bottom: 0.5cm;
            display: flex;
            justify-content: space-between;
        }
        
        .content {
            page-break-before: always;
        }
        
        h1 {
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 2cm 0 1cm 0;
            text-align: left;
        }
        
        h2 {
            font-size: 12pt;
            font-weight: bold;
            margin: 1.5cm 0 1cm 0;
            text-align: left;
        }
        
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin: 1cm 0 0.5cm 0;
            text-align: left;
        }
        
        p {
            text-indent: 1.25cm;
            margin-bottom: 0.5cm;
            text-align: justify;
        }
        
        .references {
            page-break-before: always;
        }
        
        .references-title {
            font-weight: bold;
            font-size: 12pt;
            text-align: center;
            margin-bottom: 2cm;
            text-transform: uppercase;
        }
        
        .reference-item {
            margin-bottom: 1cm;
            text-indent: -0.5cm;
            margin-left: 0.5cm;
            text-align: justify;
        }
        
        @media print {
            .cover-page, .abstract-page, .toc, .content, .references {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <!-- Capa -->
    <div class="cover-page">
        <div>
            ${institution ? `<div class="institution">${institution}</div>` : ''}
            ${course ? `<div class="course">${course}</div>` : ''}
        </div>
        
        <div class="author">${author}</div>
        
        <div class="title">${title}</div>
        
        <div>
            ${advisor ? `<div class="advisor">Orientador: ${advisor}</div>` : ''}
            <div class="date">${date || new Date().getFullYear()}</div>
        </div>
    </div>

    ${abstract ? `
    <!-- Resumo -->
    <div class="abstract-page">
        <div class="abstract-title">Resumo</div>
        <div class="abstract-content">${abstract}</div>
        ${keywords ? `<div class="keywords">Palavras-chave: ${keywords.join('; ')}.</div>` : ''}
    </div>
    ` : ''}

    <!-- Sumário -->
    <div class="toc">
        <div class="toc-title">Sumário</div>
        ${this.generateTOCHTML(sections)}
    </div>

    <!-- Conteúdo -->
    <div class="content">
        ${sectionsHTML}
    </div>

    ${referencesHTML ? `
    <!-- Referências -->
    <div class="references">
        <div class="references-title">Referências</div>
        ${referencesHTML}
    </div>
    ` : ''}
</body>
</html>`
  }

  private generateSectionHTML(section: DocumentSection, level: number = 1): string {
    const tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
    
    let html = `<${tag}>${section.title}</${tag}>\n`
    
    // Split content into paragraphs and wrap each in <p> tags
    const paragraphs = section.content.split('\n\n').filter(p => p.trim())
    html += paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n')
    
    if (section.subsections) {
      const subsectionsHTML = section.subsections
        .map(subsection => this.generateSectionHTML(subsection, level + 1))
        .join('\n')
      html += '\n' + subsectionsHTML
    }
    
    return html
  }

  private generateTOCHTML(sections: DocumentSection[], level: number = 1): string {
    return sections.map(section => {
      const indent = '&nbsp;'.repeat((level - 1) * 4)
      let toc = `<div class="toc-item">${indent}${section.title}<span>...</span></div>`
      
      if (section.subsections) {
        toc += this.generateTOCHTML(section.subsections, level + 1)
      }
      
      return toc
    }).join('\n')
  }

  private generateReferencesHTML(references: Reference[]): string {
    return references.map(ref => {
      let citation = `${ref.author}. <strong>${ref.title}</strong>. `
      
      if (ref.journal) {
        citation += `<em>${ref.journal}</em>, `
      }
      
      if (ref.publisher) {
        citation += `${ref.publisher}, `
      }
      
      citation += `${ref.year}.`
      
      if (ref.pages) {
        citation += ` p. ${ref.pages}.`
      }
      
      if (ref.url) {
        citation += ` Disponível em: &lt;${ref.url}&gt;.`
      }
      
      if (ref.doi) {
        citation += ` DOI: ${ref.doi}.`
      }
      
      return `<div class="reference-item">${citation}</div>`
    }).join('\n')
  }

  generateLaTeX(content: DocumentContent): string {
    const { title, author, institution, course, advisor, date, abstract, keywords, sections, references } = content

    const sectionsLatex = sections.map(section => this.generateSectionLatex(section)).join('\n\n')
    const bibEntries = references?.map(ref => this.generateBibEntry(ref)).join('\n\n') || ''

    return `\\documentclass[12pt,a4paper]{article}

% Pacotes necessários
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[brazil]{babel}
\\usepackage{geometry}
\\usepackage{times}
\\usepackage{setspace}
\\usepackage{indentfirst}
\\usepackage{graphicx}
\\usepackage{float}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage[hidelinks]{hyperref}

% Configurações ABNT
\\geometry{
    top=3cm,
    bottom=2cm,
    left=3cm,
    right=2cm
}

\\onehalfspacing
\\setlength{\\parindent}{1.25cm}

% Informações do documento
\\title{${title}}
\\author{${author}}
\\date{${date || '\\today'}}

\\begin{document}

% Capa
\\begin{titlepage}
    \\centering
    \\vspace*{2cm}
    
    ${institution ? `\\textbf{\\large ${institution}}\\\\[0.5cm]` : ''}
    ${course ? `\\textbf{${course}}\\\\[2cm]` : ''}
    
    \\textbf{\\Large ${author}}\\\\[3cm]
    
    \\textbf{\\LARGE ${title}}\\\\[3cm]
    
    \\vfill
    
    ${advisor ? `\\begin{flushright}
        Orientador: ${advisor}
    \\end{flushright}` : ''}
    
    \\vspace{2cm}
    
    \\textbf{${date || new Date().getFullYear()}}
\\end{titlepage}

\\newpage

% Resumo
${abstract ? `
\\section*{Resumo}
${abstract}

${keywords ? `\\textbf{Palavras-chave:} ${keywords.join('; ')}.` : ''}

\\newpage
` : ''}

% Sumário
\\tableofcontents
\\newpage

% Conteúdo
${sectionsLatex}

% Referências
${references && references.length > 0 ? `
\\newpage
\\begin{thebibliography}{99}
${references.map((ref, index) => `\\bibitem{ref${index + 1}} ${this.formatReference(ref)}`).join('\n')}
\\end{thebibliography}
` : ''}

\\end{document}`
  }

  private generateSectionLatex(section: DocumentSection, level: number = 1): string {
    const sectionCommand = level === 1 ? 'section' : level === 2 ? 'subsection' : 'subsubsection'
    
    let latex = `\\${sectionCommand}{${section.title}}\n${section.content}`
    
    if (section.subsections) {
      const subsectionsLatex = section.subsections
        .map(subsection => this.generateSectionLatex(subsection, level + 1))
        .join('\n\n')
      latex += '\n\n' + subsectionsLatex
    }
    
    return latex
  }

  private generateBibEntry(ref: Reference): string {
    const { id, type, title, author, year, journal, publisher, pages, url, doi } = ref
    
    let entry = `@${type}{${id},\n  title={${title}},\n  author={${author}},\n  year={${year}}`
    
    if (journal) entry += `,\n  journal={${journal}}`
    if (publisher) entry += `,\n  publisher={${publisher}}`
    if (pages) entry += `,\n  pages={${pages}}`
    if (url) entry += `,\n  url={${url}}`
    if (doi) entry += `,\n  doi={${doi}}`
    
    entry += '\n}'
    
    return entry
  }

  private formatReference(ref: Reference): string {
    let citation = `${ref.author}. \\textbf{${ref.title}}. `
    
    if (ref.journal) {
      citation += `\\textit{${ref.journal}}, `
    }
    
    if (ref.publisher) {
      citation += `${ref.publisher}, `
    }
    
    citation += `${ref.year}.`
    
    if (ref.pages) {
      citation += ` p. ${ref.pages}.`
    }
    
    if (ref.url) {
      citation += ` Disponível em: \\url{${ref.url}}.`
    }
    
    if (ref.doi) {
      citation += ` DOI: ${ref.doi}.`
    }
    
    return citation
  }

  async generateDocumentResponse(content: DocumentContent): Promise<{
    documentId: string
    htmlUrl: string
    latexUrl: string
    title: string
  }> {
    const documentId = crypto.randomBytes(16).toString('hex')
    
    return {
      documentId,
      htmlUrl: `/api/document/${documentId}/html`,
      latexUrl: `/api/document/${documentId}/latex`,
      title: content.title
    }
  }
}
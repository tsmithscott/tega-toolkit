from fpdf import FPDF


class Template:
    @staticmethod
    def generate_form(feedback: dict, post_test: dict, form_id: str, game_id: str, game_name: str) -> str:
        page_replacements = [
            ('{{FID}}', form_id),
            ('{{GID}}', game_id),
            ('{{GNAME}}', game_name),
            ('{{Q_1}}', feedback['1']),
            ('{{Q_2}}', feedback['2']),
            ('{{Q_3}}', feedback['3']),
            ('{{Q_4}}', feedback['4']),
            ('{{Q_5}}', feedback['5']),
            ('{{Q_6}}', feedback['6']),
            ('{{PT_Q_1}}', post_test['1']),
            ('{{PT_Q_2}}', post_test['2']),
            ('{{PT_Q_3}}', post_test['3']),
            ('{{PT_Q_4}}', post_test['4']),
            ('{{PT_Q_5}}', post_test['5']),
            ('{{PT_Q_6}}', post_test['6']),
            ('{{PT_Q_7}}', post_test['7']),
            ('{{PT_Q_8}}', post_test['8']),
            ('{{PT_Q_9}}', post_test['9']),
            ('{{PT_Q_10}}', post_test['10'])
        ]
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font('Arial', size = 11)
        
        file = open('./static/pdf_templates/form-template.txt', 'r')
        
        for line in file:
            for (old, new) in page_replacements:
                line = line.replace(old, new)
            
            pdf.cell(200, 10, txt = line, ln = 1, align = 'C')
            
        pdf.output(f'tmp/{game_id}-{form_id}-form.pdf')
        
        return f'./tmp/{game_id}-{form_id}-form.pdf'

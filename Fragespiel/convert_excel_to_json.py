import pandas as pd
import json
import os

# Definiere den relativen Pfad zur Excel-Datei und zur Ausgabe-JS-Datei
excel_file_path = "Fragen/Fragen.xlsx"
output_js_file = "fragen.js"

def convert_excel_to_js():
    try:
        # Überprüfen, ob die Excel-Datei existiert
        if not os.path.exists(excel_file_path):
            raise FileNotFoundError(f"Excel-Datei nicht gefunden: {excel_file_path}")

        # Lese die Excel-Datei ein
        questions_df = pd.read_excel(excel_file_path, sheet_name='Tabelle1')

        # Konvertiere das DataFrame in eine Liste von Dictionaries
        questions_list = questions_df.to_dict(orient='records')

        # Formatiere die Liste als JavaScript-Variable
        js_content = "const questionsData = " + json.dumps(questions_list, ensure_ascii=False, indent=4) + ";"

        # Speichere die JS-Datei
        with open(output_js_file, 'w', encoding='utf-8') as js_file:
            js_file.write(js_content)

        print(f"Konvertierung erfolgreich! JS-Datei gespeichert unter: {output_js_file}")

    except Exception as e:
        print(f"Fehler bei der Konvertierung: {e}")

if __name__ == "__main__":
    convert_excel_to_js()
import json

# Lire le fichier JSON
with open('charlock_test_cursor_final_output_v7.json', 'r') as f:
    data = json.load(f)

# Convertir les références
for item in data:
    if 'Intent référence' in item:
        # Convertir en entier pour supprimer les zéros non significatifs
        item['Intent référence'] = str(int(item['Intent référence']))

# Sauvegarder le fichier modifié
with open('charlock_test_cursor_final_output_v7.json', 'w') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Conversion terminée") 
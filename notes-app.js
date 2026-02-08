const fs = require('fs');
const readline = require('readline');

const NOTES_FILE = 'notes.json';


function loadNotes() {
    try {
        if (fs.existsSync(NOTES_FILE)) {
            const data = fs.readFileSync(NOTES_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Ошибка загрузки заметок:', error.message);
    }
    
    return [{
        id: 1,
        text: "Добро пожаловать в приложение Заметки! Это ваша первая заметка.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }];
}

function saveNotes(notes) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
}

function displayNotes(notes) {
    console.log('\n=== ВАШИ ЗАМЕТКИ ===');
    notes.forEach((note, index) => {
        console.log(`${index + 1}. ${note.text.substring(0, 50)}${note.text.length > 50 ? '...' : ''}`);
        console.log(`   Обновлено: ${new Date(note.updatedAt).toLocaleString('ru-RU')}`);
    });
    console.log('===================\n');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    console.log('=== Консольное приложение "Заметки" ===');
    console.log('Данные сохраняются в файле notes.json\n');
    
    let notes = loadNotes();
    
    while (true) {
        console.log('\nМЕНЮ:');
        console.log('1. Показать все заметки');
        console.log('2. Добавить новую заметку');
        console.log('3. Редактировать заметку');
        console.log('4. Удалить заметку');
        console.log('5. Выйти');
        
        const choice = await new Promise(resolve => {
            rl.question('\nВведите номер выбора (1-5): ', resolve);
        });
        
        switch (choice) {
            case '1':
                displayNotes(notes);
                break;
                
            case '2':
                const newText = await new Promise(resolve => {
                    rl.question('Введите текст заметки: ', resolve);
                });
                
                if (newText.trim()) {
                    const newNote = {
                        id: notes.length + 1,
                        text: newText.trim(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    notes.push(newNote);
                    saveNotes(notes);
                    console.log('Заметка добавлена!');
                } else {
                    console.log('Текст заметки не может быть пустым.');
                }
                break;
                
            case '3':
                displayNotes(notes);
                if (notes.length > 0) {
                    const noteNum = await new Promise(resolve => {
                        rl.question('Введите номер заметки для редактирования: ', resolve);
                    });
                    
                    const index = parseInt(noteNum) - 1;
                    if (index >= 0 && index < notes.length) {
                        const newText = await new Promise(resolve => {
                            rl.question('Введите новый текст: ', resolve);
                        });
                        
                        if (newText.trim()) {
                            notes[index].text = newText.trim();
                            notes[index].updatedAt = new Date().toISOString();
                            saveNotes(notes);
                            console.log('Заметка обновлена!');
                        } else {
                            console.log('Текст заметки не может быть пустым.');
                        }
                    } else {
                        console.log('Неверный номер заметки!');
                    }
                } else {
                    console.log('Нет заметок для редактирования.');
                }
                break;
                
            case '4':
                displayNotes(notes);
                if (notes.length > 0) {
                    const noteNum = await new Promise(resolve => {
                        rl.question('Введите номер заметки для удаления: ', resolve);
                    });
                    
                    const index = parseInt(noteNum) - 1;
                    if (index >= 0 && index < notes.length) {
                        const deletedText = notes[index].text.substring(0, 30);
                        notes.splice(index, 1);
                        saveNotes(notes);
                        console.log(`Заметка удалена: "${deletedText}..."`);
                    } else {
                        console.log('Неверный номер заметки!');
                    }
                } else {
                    console.log('Нет заметок для удаления.');
                }
                break;
                
            case '5':
                console.log('До свидания! Ваши заметки сохранены.');
                rl.close();
                process.exit(0);
                
            default:
                console.log('Неверный выбор! Пожалуйста, введите 1-5.');
        }
    }
}


main();
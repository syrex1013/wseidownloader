# 🎓 WSEI Downloader Kursów

> **Profesjonalny automatyczny pobieracz materiałów kursowych dla platformy e-learningowej WSEI** 🚀

<!-- Dodaj tutaj swoje zdjęcie, gdy będzie gotowe -->
![WSEI Downloader](https://i.imgur.com/sgB5MpJ.png)

[![Wersja](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/yourusername/wsei-course-downloader)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)](https://nodejs.org/)
[![Licencja](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Platforma](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

## ✨ Funkcje

🔧 **Profesjonalny i Niezawodny**

- 🔄 **Inteligentna Logika Ponawiania** - Obsługuje przerwy w połączeniu sieciowym
- 🎯 **Inteligentny Wybór Kursów** - Wybierz konkretne kursy lub pobierz wszystkie
- 📊 **Śledzenie Postępów w Czasie Rzeczywistym** - Piękne paski postępu i aktualizacje statusu
- 🛡️ **Odporność na Błędy** - Kompleksowa obsługa błędów i logowanie
- ⚡ **Równoległe Pobieranie** - Optymalizowane przetwarzanie wsadowe dla szybszego pobierania

📚 **Zarządzanie Kursami**

- 📖 **Wiele Typów Plików** - Obsługuje PDF-y, wideo, dokumenty i inne
- 🏗️ **Zorganizowana Struktura** - Automatycznie tworzy foldery specyficzne dla kursów
- 🔍 **Inteligentne Wykrywanie** - Automatycznie identyfikuje zasoby do pobrania
- 💾 **Zapobieganie Duplikatom** - Pomija już pobrane pliki

🎨 **Doświadczenie Użytkownika**

- 🖥️ **Interaktywny CLI** - Piękny interfejs terminala z kolorami
- 📈 **Szczegółowe Statystyki** - Śledź pobrania, pominięcia i błędy
- 📝 **Kompleksowe Logowanie** - Szczegółowe dzienniki do rozwiązywania problemów
- ⚙️ **Łatwa Konfiguracja** - Prosta konfiguracja oparta na JSON

## 🚀 Szybki Start

### Wymagania

- 📦 **Node.js** w wersji 14.0.0 lub nowszej
- 🔐 Ważne dane logowania do platformy e-learningowej WSEI
- 🌐 Stabilne połączenie internetowe

### Instalacja

```bash
# Sklonuj repozytorium
git clone https://github.com/yourusername/wsei-course-downloader.git
cd wsei-course-downloader

# Zainstaluj zależności
npm install

# Utwórz plik konfiguracyjny
cp config.example.json config.json
```

### Konfiguracja

Edytuj `config.json`, dodając swoje dane logowania:

```json
{
  "credentials": {
    "username": "your_wsei_username",
    "password": "your_wsei_password"
  },
  "urls": {
    "loginUrl": "https://dl.wsei.pl/login/index.php",
    "coursesUrl": "https://dl.wsei.pl/my/courses.php"
  },
  "downloadDir": "downloads",
  "browser": {
    "headless": true,
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled"
    ]
  }
}
```

### Użycie

```bash
# Uruchom pobieracz
npm start
# lub
node index.js

# Uruchom w trybie deweloperskim (z debugowaniem)
npm run dev
```

## 📋 Jak to działa

1. **🔐 Autentykacja** - Bezpieczne logowanie do platformy WSEI
2. **📚 Odkrywanie Kursów** - Przeszukuje dostępne kursy
3. **🎯 Menu Wyboru** - Interaktywne menu wyboru kursów
4. **📊 Analiza** - Bada każdy kurs pod kątem materiałów do pobrania
5. **⚡ Pobieranie** - Równoległe, wznawialne pobieranie z śledzeniem postępów
6. **📁 Organizacja** - Zapisuje pliki w uporządkowanych folderach

## 🛠️ Zaawansowana Konfiguracja

### Opcje Przeglądarki

```json
{
  "browser": {
    "headless": false, // Ustaw na false do debugowania
    "slowMo": 100, // Dodaj opóźnienie między akcjami
    "args": ["--no-sandbox", "--disable-setuid-sandbox"]
  }
}
```

### Ustawienia Pobierania

```json
{
  "downloadDir": "my-courses", // Własny katalog pobierania
  "concurrency": 3, // Liczba jednoczesnych pobrań
  "retryAttempts": 5, // Maksymalna liczba prób ponowienia pobrania dla każdego pliku
  "timeout": 120000 // Limit czasu pobierania w milisekundach
}
```

## 📊 Śledzenie Postępów

Pobieracz zapewnia aktualizacje w czasie rzeczywistym dotyczące:

- 📈 **Ogólnych Postępów** - Przetworzone pliki vs. wszystkie pliki
- 💾 **Prędkości Pobierania** - Aktualna prędkość transferu
- 📁 **Aktualnego Pliku** - Co jest teraz pobierane
- ✅ **Wskaźnika Sukcesu** - Pobrania vs. błędy
- 💿 **Całkowitego Rozmiaru** - Skumulowane dane pobierane

## 🔧 Skrypty

| Komenda            | Opis                              |
| ------------------ | --------------------------------- |
| `npm start`        | 🚀 Uruchom pobieracz              |
| `npm run dev`      | 🔍 Uruchom z włączonym debugowaniem |
| `npm run lint`     | 🧹 Sprawdź styl kodu              |
| `npm run lint:fix` | ✨ Napraw problemy ze stylem kodu |
| `npm run clean`    | 🗑️ Wyczyść pobrania i dzienniki   |
| `npm run setup`    | ⚙️ Utwórz przykładową konfigurację |

## 📝 Logowanie

Kompleksowy system logowania:

- **📊 Ogólne Dzienniki** - Przebieg aplikacji i status
- **📥 Dzienniki Pobierania** - Szczegółowe informacje o pobieraniu
- **❌ Dzienniki Błędów** - Nieudane pobrania z informacją o próbach ponowienia
- **🔍 Dzienniki Debugowania** - Szczegółowe informacje debugowania (tryb deweloperski)

Dzienniki są przechowywane w katalogu `logs/` z automatycznym rotowaniem.

## 🤝 Współtworzenie

Zapraszamy do współtworzenia! 🎉

1. 🍴 Sforkuj repozytorium
2. 🌟 Utwórz swoją gałąź funkcji (`git checkout -b feature/amazing-feature`)
3. ✅ Wprowadź swoje zmiany (`git commit -m 'Dodaj niesamowitą funkcję'`)
4. 📤 Wypchnij do gałęzi (`git push origin feature/amazing-feature`)
5. 🔄 Otwórz Pull Request

### Wytyczne Deweloperskie

- 📏 Przestrzegaj konfiguracji ESLint
- 📝 Dodaj komentarze JSDoc do nowych funkcji
- 🧪 Testuj dokładnie swoje zmiany
- 📚 Aktualizuj dokumentację w razie potrzeby

## 🛡️ Bezpieczeństwo

- 🔒 Dane logowania są przechowywane tylko lokalnie
- 🌐 Żadne dane nie są wysyłane na zewnętrzne serwery
- 🛡️ Korzysta z bezpiecznych połączeń HTTPS
- 🔐 Implementuje funkcje bezpieczeństwa przeglądarki

## 📚 Zależności

### Podstawowe Zależności

- **🎭 Puppeteer** - Automatyzacja przeglądarki
- **📡 Axios** - Klient HTTP do pobierania
- **🎨 Chalk** - Stylizacja terminala
- **❓ Inquirer** - Interaktywne zapytania CLI
- **📊 CLI Progress** - Paski postępu

### Zależności Deweloperskie

- **🧹 ESLint** - Lintowanie kodu i wymuszanie stylu

## 🐛 Rozwiązywanie Problemów

### Typowe Problemy

**❌ Nieudane Logowanie**

- Zweryfikuj dane logowania w `config.json`
- Sprawdź dostępność platformy WSEI
- Upewnij się, że 2FA nie jest włączone (nieobsługiwane)

**❌ Problemy z Pobieraniem**

- Sprawdź stabilność połączenia internetowego
- Zwiększ wartości limitu czasu w konfiguracji
- Przejrzyj dzienniki błędów, aby znaleźć konkretne problemy

**❌ Problemy z Przeglądarką**

- Spróbuj uruchomić z `headless: false` do debugowania
- Zaktualizuj przeglądarkę Chrome/Chromium
- Sprawdź kompatybilność argumentów przeglądarki

### Uzyskiwanie Pomocy

- 📖 Sprawdź [Wiki](https://github.com/yourusername/wsei-course-downloader/wiki)
- 🐛 Zgłaszaj błędy w [Issues](https://github.com/yourusername/wsei-course-downloader/issues)
- 💬 Dołącz do dyskusji w [Discussions](https://github.com/yourusername/wsei-course-downloader/discussions)

## 📄 Licencja

Ten projekt jest licencjonowany na warunkach licencji MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## 🙏 Podziękowania

- 🎓 WSEI University za udostępnienie platformy e-learningowej
- 🌟 Społeczności open-source za niesamowite narzędzia i biblioteki
- 👥 Wszystkim współtwórcom, którzy pomagają ulepszać ten projekt

## ⭐ Historia Gwiazdek

Jeśli ten projekt Ci pomógł, rozważ zostawienie gwiazdki! ⭐

---

<div align="center">

**Stworzone z ❤️ przez Zespół WSEI Downloader**

[⬆ Powrót na górę](#-wsei-pobieracz-kursów)

</div>

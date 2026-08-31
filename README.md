# Pless Finest — panel zamówień

Lekka aplikacja webowa do zarządzania zamówieniami koszulek Pless Finest. Działa bez serwera, instalacji i zewnętrznych zależności — wystarczy otworzyć `index.html` albo opublikować projekt przez GitHub Pages.

## Funkcje

- sześć modeli Pless Finest oraz pozycje customowe,
- rozwijana lista kolorów z automatyczną podpowiedzią standardu dla każdego modelu i możliwością dowolnego mieszania,
- wiele koszulek w jednym zamówieniu,
- dane kontaktowe klienta,
- odbiór własny lub wysyłka z adresem / paczkomatem,
- status realizacji i płatności,
- filtrowanie i wyszukiwanie,
- podsumowanie aktywnych zamówień, odbiorów, wysyłek i customów,
- zapis danych w przeglądarce oraz opcjonalna wspólna baza w Google Sheets,
- automatyczna synchronizacja telefonu i komputera co 30 sekund,
- kolejka zmian na wypadek chwilowego braku internetu,
- eksport CSV oraz import / eksport kopii JSON,
- jasny i ciemny motyw,
- pełna obsługa telefonu i komputera.

## Identyfikacja wizualna

Interfejs wykorzystuje oryginalne logo Pless Finest. Plik znajduje się w katalogu `assets/`. Styl panelu nawiązuje do materiałów wystawowych: chłodna szarość, czerń, gotycka typografia i akcenty w kolorach kolekcji.

## Uruchomienie

Otwórz plik `index.html` w przeglądarce. Nie trzeba instalować Node.js ani uruchamiać serwera.

## Publikacja na GitHub Pages

1. Utwórz nowe repozytorium na GitHubie.
2. Wrzuć do niego wszystkie pliki z tego katalogu.
3. Wejdź w **Settings → Pages**.
4. Wybierz **Deploy from a branch**, gałąź `main` i katalog `/ (root)`.
5. Po zapisaniu GitHub pokaże publiczny adres aplikacji.

## Wspólna baza Google Sheets

Bez konfiguracji dane nadal zapisują się lokalnie. Aby widzieć te same zamówienia na telefonie i komputerze, użyj dołączonego pliku `pless-finest-monitor-zamowien.xlsx`, skryptu `google-apps-script/Code.gs` i instrukcji `INSTRUKCJA-GOOGLE-SHEETS.md`. Po konfiguracji kliknij wskaźnik **Lokalnie** w górnym pasku aplikacji i wpisz adres wdrożenia oraz prywatny klucz.

Regularnie używaj również przycisku **Kopia**, aby pobrać pełną kopię JSON. Przycisk **CSV** tworzy arkusz do analizy lub druku.

## Modele

- Welcome to the Lustschloss
- 2 of Pless Most Wanted
- Daisy Me Rollin
- Eis Eis Baby
- Mo Bisons Mo Problems
- Still Telemann

## Standardowe kolory

- Welcome to the Lustschloss — Burgund
- 2 of Pless Most Wanted — Wolf Grey
- Daisy Me Rollin — Black
- Eis Eis Baby — White
- Mo Bisons Mo Problems — Mexican Green
- Still Telemann — Ivory

## Struktura

```text
index.html   — struktura interfejsu
styles.css   — wygląd i responsywność
app.js       — logika, zapis i eksport danych
assets/      — logo Pless Finest
google-apps-script/Code.gs — połączenie z Arkuszem Google
INSTRUKCJA-GOOGLE-SHEETS.md — konfiguracja krok po kroku
```

## Ważne

Nie wpisuj adresu skryptu ani klucza `API_TOKEN` bezpośrednio do kodu i nie publikuj ich na GitHubie. Aplikacja przechowuje te dane wyłącznie w pamięci przeglądarki na każdym urządzeniu.

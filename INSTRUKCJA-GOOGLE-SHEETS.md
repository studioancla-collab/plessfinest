# Wspólne zamówienia na telefonie i komputerze

Obecna aplikacja potrafi działać lokalnie, ale po skonfigurowaniu synchronizacji używa Arkusza Google jako wspólnej bazy. Arkusz można równocześnie otworzyć na Dysku Google i obserwować zamówienia, statusy oraz podsumowanie.

## 1. Wgraj szablon

1. Pobierz plik `pless-finest-monitor-zamowien.xlsx`.
2. Na Dysku Google wybierz **Nowy → Prześlij plik** i wskaż pobrany plik.
3. Otwórz plik przez Arkusze Google.
4. Wybierz **Plik → Zapisz jako Arkusze Google**.
5. Pracuj dalej na nowej, natywnej wersji Arkusza Google.

Nie zmieniaj nazw zakładek `Zamowienia` i `Pozycje` ani kolejności kolumn.

## 2. Dodaj skrypt

1. W otwartym Arkuszu Google wybierz **Rozszerzenia → Apps Script**.
2. Usuń zawartość pliku `Code.gs` i wklej kod z folderu `google-apps-script/Code.gs` w projekcie aplikacji.
3. W Apps Script otwórz **Ustawienia projektu → Właściwości skryptu**.
4. Dodaj właściwość o nazwie `API_TOKEN` i wpisz długi, losowy klucz, np. co najmniej 32 znaki. Zachowaj ten klucz prywatnie.
5. W edytorze wybierz funkcję `setup` i kliknij **Uruchom**. Przy pierwszym uruchomieniu zaakceptuj uprawnienia do arkusza.

## 3. Opublikuj połączenie

1. Kliknij **Wdróż → Nowe wdrożenie**.
2. Wybierz typ **Aplikacja internetowa**.
3. Ustaw **Wykonuj jako: Ja**.
4. Ustaw dostęp na **Każdy**.
5. Kliknij **Wdróż** i skopiuj adres kończący się `/exec`.

Dostęp do danych chroni klucz `API_TOKEN`. Nie publikuj go w repozytorium ani nie wysyłaj osobom postronnym.

## 4. Połącz aplikację

1. Otwórz aplikację Pless Finest.
2. Kliknij przycisk stanu synchronizacji w górnym pasku.
3. Wklej adres `/exec` oraz ten sam `API_TOKEN`.
4. Kliknij **Połącz i synchronizuj**.
5. Powtórz ten krok na telefonie i komputerze.

Przy pierwszym połączeniu rzeczywiste zamówienia zapisane lokalnie zostaną dodane do pustego arkusza. Zamówienia przykładowe nie są synchronizowane. Po połączeniu aplikacja automatycznie sprawdza zmiany co 30 sekund i przy każdym zapisie.

## Prywatność

Arkusz zawiera dane kontaktowe klientów. Nie udostępniaj go publicznie. Adres skryptu i token przechowywane są lokalnie w przeglądarce danego urządzenia, dlatego konfigurację należy wykonać osobno na telefonie i komputerze.

# En cv & portfolio sida

Detta repot innehåller en webbsida om och skapad av Jens Bengtsson. Den publika webbplatsen hittas på https://jens-dashboard-assignment.netlify.app/

## Webbplatsens innehåll

Webbplatsen består av en dashboard som går att anpassa lite efter användarens behov. det användaren kan gör är att:

-Ställa in rubriken.
-Lägga till länkar.
-Hämta vädret för den position användaren befinner sig på, även skriva in önskad plats.
-Kolla växel kursen mellan 160 olika valutor.
-Skriva ned anteckningar.
-byta bakgrundsbild efter önskat team.

## Resonemang

Några av styrkorna med min koda är att den är väldigt väl strukturerad. Med tydliga sectioner till dem olika delarna på webbsidan. Varje funktion är har en kort kommentar om vad som händer i funktionen, man kan också få en hint vad den gör av funktionens namn. HTML & CSS koden är också den indelad i sectioner för att enkelt veta vad koden gör. Detta gör koden lätt läst och lätt att underhålla. Har få globala variabler och några globala referenser som är tydligt kommenterade för vad dem används till.

Har försökt att hålla funktionerna korta, i några fall kan de kanske vara möjligt att dela upp dem i två funktioner istället en längre det kan vara en svaghet. Skulle även kunna ha tydligare interaktioner som till exempel när man ska lägga till en länk och skriver in en felaktig sådan så kommer det upp en text att det är fel format eller felaktig länk, då kanske man kunde rödmarkerat fältet eller lagt på en annimation så att de "skaka" till lite för att uppmärksamma användaren på att något gått fel. Det har jag däremot gjort när man ska kolla valuta kursen. Om användaren då inte fyller i ett fält blir det rödmarkerat tills det är korrekt i fyllt. Eventuellt mer än att när man hovrar över något som går att klicka på så blir de lite transparant och muspekaren ändras till "pekfingerhanden/pointer" kanske att de finns mer att önska där.

Hade kunnat läsa in de olika dagarna för vädret dynamiskt med JS då innehållet ändå läses in och strukturen ser likadana ut, för att minska lite HTML kod.
Som användare vill jag kunna boka datum och tid samt ange antal spelare så att jag kan reservera 1 eller flera baner i bowlinghallen.

----

Scenario: User wants to make a booking.
Given: The user navigates to the booking screen.
And: Fills in the forms.


----

Som användare vill jag kunna välja skostorlek för varje spelare så varje spelare får skor som passar.

----

Scenario: User wants to select shoesize for each participant
Given: The user navigates to the booking screen.
And: Fills in all the forms.
And: The users is able to add each participants shoesize individually.


----

Som användare vill jag kunna ta bort ett fält för skostorlek om jag råkade klicka i ett för mycket så jag inte boka skor i onödan.

---

Scenario: User wants to select shoesize for each participant
Given: The user navigates to the booking screen.
And: Fills in all the forms.
And: The users adds each participants shoesize individually.
Then: The user accidentally adds too many shoes per participants.
And: The user removes a participants shoesize.

---

Som användare vill jag kunna skicka iväg min reservation och få tillbaka ett ett bokningsnummer och totalsumma så jag vet hur mycket jag ska betala. (120 kr / person + 100 kr / bana).

---

Scenario: User wants to complete a booking
Given: The user navigates to the booking screen.
And: Fills in all the forms.
And: The users adds each participants shoesize individually.
When: The user requests to book.
Then: Return confirmation on booking.
And: Return the sum that should be paid.

---

Som användare vill jag kunna navigera mellan boknings-och bekräftelsevyn.

---

Scenario: User wants to navigate between booking and confirmation.
Given: The user is on the landing page.
When: The user is on the booking screen.
Then: The user can navigate to the confirmation screen. 
And: When the user is on the confirmation screen they can navigate to the booking screen.

---


Får godkänt ska du:

Gjort acceptanskriterier till varje user story som sedan blir testfall. (Hur många acceptanskriterier till varje story är svårt att säga utan det gäller att hitta en bra balans, diskutera gärna med mig här). Du kan skriva 
acceptanskriterierna i README:n för ditt Githubrepo.

Gjort tester i React testing library för alla user stories som går grönt när man kör dessa.

Mockat POST-anrop med Mock service worker.

Alla tester finns representerade i acceptanskriterierna.

Testerna triggas via en Github actions på main-branchen. Det bör alltså finnas en grön bock i ditt Github repo när du lämnar in examinationen.

Får Väl Godkänt ska du:

Har gjort acceptanskriterier samt tester för felhantering (exempelvis går inte att lägga en beställning om inte alla fält är ifyllda).


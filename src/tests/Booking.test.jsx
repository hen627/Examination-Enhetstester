import * as React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router,useNavigate } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event'
import Booking from '../views/Booking';
import Confirmation from '../views/Confirmation';
import { expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';


const server = setupServer(
  http.post('https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com', (request, params, cookies) => {

  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
    ...(await vi.importActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

function bookingRender() {
  return render(
    <Router>
      <Booking />
    </Router>
  );
}

function confirmationRender() {
  return render(
    <Router>
      <Confirmation />
    </Router>
  );
}


export default function bookingInputs() {
  const dateInput = screen.getByLabelText("Date");
  const timeInput = screen.getByLabelText("Time");
  const personInput = screen.getByLabelText("Number of awesome bowlers");
  const laneInput = screen.getByLabelText("Number of lanes");


  fireEvent.change(dateInput, { target: { value: '2023-12-28' } });
  fireEvent.change(timeInput, { target: { value: '18:00' } });
  fireEvent.change(personInput, { target: { value: 2 } });
  fireEvent.change(laneInput, { target: { value: 1 } });

  return { dateInput, timeInput, personInput, laneInput };
}


// screen.debug();


describe('Booking', () => {

  it('should be able fill all fields with values', () => {
    bookingRender();
    const { dateInput, timeInput, personInput, laneInput } = bookingInputs();

    expect(dateInput.value).toBe('2023-12-28');
    expect(timeInput.value).toBe('18:00');
    expect(personInput.value).toBe("2");
    expect(laneInput.value).toBe("1");

    //tomorrow we replace the above with inputting text into the fields
    //then we fix the expect to expect inputs in the fields.
  });
  
  it('should be able to add shoesizes based on amount of players', async () => {
    bookingRender();
    const { dateInput, timeInput, personInput, laneInput } = bookingInputs();
    const addShoesElement = screen.getByRole("button", {
      name: "+"
    });

    for (let index = 0; index < personInput.value; index++) {
      await userEvent.click(addShoesElement);
      let shoeSizeInput = screen.getByLabelText(`Shoe size / person ${index+1}`);
      fireEvent.change(shoeSizeInput, { target: { value: 46 } });
    }
    const shoesInput= screen.getByLabelText("Shoe size / person 2");
    expect(shoesInput.value).toBe("46");
  })
  it('Should be able to add and remove shoes based on need', async () => {
    bookingRender();
    
    const addShoesElement = screen.getByRole("button", {
      name: "+"
    });
    
    await userEvent.click(addShoesElement);
    let shoeSizeInput = screen.getByLabelText(`Shoe size / person 1`);
    expect(shoeSizeInput).toBeInTheDocument();
    
    const removeShoesElement = screen.getByRole("button", {
      name: "-"
    });
    await userEvent.click(removeShoesElement);
    expect(shoeSizeInput).not.toBeInTheDocument();
  })

  it('Should receive a booking confirmation through api on successfull booking', async () => {
    bookingRender();
    const { dateInput, timeInput, personInput, laneInput } = bookingInputs();

    const addShoesElement = screen.getByRole("button", {
      name: "+"
    });
    for (let index = 0; index < personInput.value; index++) {
      await userEvent.click(addShoesElement);
      let shoeSizeInput = screen.getByLabelText(`Shoe size / person ${index+1}`);
      fireEvent.change(shoeSizeInput, { target: { value: 46 } });
    }

    server.use(
      http.post('https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com', (req, res, ctx) => {
        const calculatePrice = personInput.value * 120 + laneInput.value * 100;
        const confirmationDetails = {
          when: dateInput.value,
          time: timeInput.value,
          people: personInput.value,
          lanes: laneInput.value,
          id: "CrazyRandomBookingNumber",
          price: calculatePrice
        }
        console.log(confirmationDetails)
      return HttpResponse.json({ confirmationDetails });
      })
    );

    const buttonElement = screen.getByText("strIIIIIike!");
    await userEvent.click(buttonElement);

  });

  it('Tests so user can navigate to confirmation', async () => {
    bookingRender();

    await userEvent.click(screen.getByText("Confirmation"))
    screen.debug();

    expect(mockedUsedNavigate).toBeCalled()
    mockedUsedNavigate.mockRestore();
});


it('Tests so user can navigate to booking', async () => {
  confirmationRender();

  await userEvent.click(screen.getByText("Booking"))
  screen.debug();

  expect(mockedUsedNavigate).toBeCalled()
  mockedUsedNavigate.mockRestore();
});

//FAILURE CONTROL

it('should not be able to book if all fields are not filled', async () => {
  bookingRender();
  const buttonElement = screen.getByText("strIIIIIike!");
  await userEvent.click(buttonElement);
  const alertElement = screen.getByText("Fill out all the fields and make sure that people and shoes is the same number.");
  expect(alertElement).toBeInTheDocument();
});


it('should not be able to book if a disproportionate amount of shoes is added', async () => {
  bookingRender();
  const { dateInput, timeInput, personInput, laneInput } = bookingInputs();
  const addShoesElement = screen.getByRole("button", {
    name: "+"
  });

  for (let index = 0; index < personInput.value-1; index++) {
    await userEvent.click(addShoesElement);
    let shoeSizeInput = screen.getByLabelText(`Shoe size / person ${index+1}`);
    await userEvent.type(shoeSizeInput, '40');

  }
  const buttonElement = screen.getByText("strIIIIIike!");
  await userEvent.click(buttonElement);
  await waitFor(() => {
  const alertElement = screen.queryByText("Fill out all the fields and make sure that people and shoes is the same number.");
  expect(alertElement).toBeInTheDocument();
  });

});


});




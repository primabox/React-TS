export interface Reservation {
  id: string;
  customerName: string;
  place: string;
  roomType: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  pricePerNight: number;
  totalPrice: number;
  specialRequests: string;
  createdAt: string;
}


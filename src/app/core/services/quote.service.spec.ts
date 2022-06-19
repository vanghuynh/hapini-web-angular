import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoreModule, HttpCacheService } from '@app/core';
import { QuoteService } from './quote.service';
//import { RoomService } from './room.service';
import { IRoom } from '@app/model/interfaces';

describe('QuoteService', () => {
  let quoteService: QuoteService;
  //let roomService: RoomService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ],
      providers: [
        HttpCacheService,
        QuoteService,
        //RoomService
      ]
    });
  }));

  beforeEach(inject([
    HttpCacheService,
    QuoteService,
    HttpTestingController
  ], (htttpCacheService: HttpCacheService,
      _quoteService: QuoteService,
      //_roomService:RoomService,
      _httpMock: HttpTestingController) => {

    quoteService = _quoteService;
    //roomService = _roomService;
    httpMock = _httpMock;

    htttpCacheService.cleanCache();
  }));

  afterEach(() => {
    httpMock.verify();
  });

  describe('getRandomQuote', () => {
    it('should return a random Chuck Norris quote', () => {
      // Arrange
      const mockQuote = { value: 'a random quote' };

      // Act
      const randomQuoteSubscription = quoteService.getRandomQuote({ category: 'toto' });

      // Assert
      randomQuoteSubscription.subscribe((quote: string) => {
        expect(quote).toEqual(mockQuote.value);
      });
      httpMock.expectOne({}).flush(mockQuote);
    });

    it('should return a string in case of error', () => {
      // Act
      const randomQuoteSubscription = quoteService.getRandomQuote({ category: 'toto' });

      // Assert
      randomQuoteSubscription.subscribe((quote: string) => {
        expect(typeof quote).toEqual('string');
        expect(quote).toContain('Error');
      });
      httpMock.expectOne({}).flush(null, {
        status: 500,
        statusText: 'error'
      });
    });

    // it('should return a room with id = 1', () => {
    //   // Search params
    //   let roomId =  1;

    //   // Act
    //   const randomRoomSubscription = roomService.getRoom(1);

    //   // Assert
    //   randomRoomSubscription.subscribe((room: IRoom) => {
    //     expect(room.id).toEqual(1);
    //   });
    // });

  });
});

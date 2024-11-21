import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-buscar-vehiculo',
  templateUrl: './buscar-vehiculo.page.html',
  styleUrls: ['./buscar-vehiculo.page.scss'],
})
export class BuscarVehiculoPage implements AfterViewInit {
  @ViewChild('searchFieldOrigen', { static: false }) searchFieldOrigen!: ElementRef; 
  @ViewChild('searchFieldDestino', { static: false }) searchFieldDestino!: ElementRef;
  
  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 };
  zoom: number = 12;
  userLocation: google.maps.LatLngLiteral | null = null;
  markers: Array<{ position: google.maps.LatLngLiteral; title: string }> = [];
  
  origen: string = "";
  destino: string = "";
  costo: number = 0;

  constructor() {}
  ngAfterViewInit() {
    const autocompleteOrigen = new google.maps.places.Autocomplete(this.searchFieldOrigen.nativeElement, {
      fields: ['geometry', 'name'],
    });

    const autocompleteDestino = new google.maps.places.Autocomplete(this.searchFieldDestino.nativeElement, {
      fields: ['geometry', 'name'],
    });
    autocompleteOrigen.addListener('place_changed', () => {
      const place = autocompleteOrigen.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        this.origen = place.name || '';
        this.center = { lat: location.lat(), lng: location.lng() };
        this.markers = [
          {
            position: { lat: location.lat(), lng: location.lng() },
            title: place.name || 'Ubicación origen',
          },
        ];
      } else {
        alert('No se pudo obtener la ubicación del lugar de origen seleccionado.');
      }
    });
    autocompleteDestino.addListener('place_changed', () => {
      const place = autocompleteDestino.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        this.destino = place.name || '';
        this.markers.push({
          position: { lat: location.lat(), lng: location.lng() },
          title: place.name || 'Ubicación destino',
        });
      } else {
        alert('No se pudo obtener la ubicación del lugar de destino seleccionado.');
      }
    });
  }
  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.center = this.userLocation;
          this.addMarker(this.userLocation);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          alert('No se pudo obtener la ubicación. Verifica los permisos.');
        }
      );
    } else {
      alert('Geolocalización no es compatible con este navegador.');
    }
  }
  addMarker(position: google.maps.LatLngLiteral) {
    this.markers.push({
      position,
      title: `Marcador ${this.markers.length + 1}`,
    });
  }
calcularDistancia() {
  if (this.origen && this.destino) {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [this.origen],
        destinations: [this.destino],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK && response) {

          if (response.rows && response.rows.length > 0) {
            const element = response.rows[0].elements[0];
            if (element && element.status === 'OK' && element.distance) {
              const distance = element.distance.text || 'Desconocida';
              const duration = element.duration ? element.duration.text : 'Desconocida';
              alert(`Distancia: ${distance}\nDuración: ${duration}`);
              this.costo = this.calculateCost(distance);
            } else {
              alert('No se pudo obtener la distancia entre el origen y el destino.');
            }
          } else {
            alert('La respuesta no contiene datos de distancia.');
          }
        } else {
          alert(`Error al obtener los datos de distancia. Estado de la respuesta: ${status}`);
        }
      }
    );
  } else {
    alert('Por favor, ingresa tanto el origen como el destino.');
  }
}
  calculateCost(distance: string): number {
    const km = parseFloat(distance.split(' ')[0].replace(',', '.'));
    return km * 2;
  }
}

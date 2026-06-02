import { Component } from '@angular/core';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class FAQ {
  faqs: FAQItem[] = [
    {
      id: 1,
      question: '¿En qué casos se necesita obligatoriamente un procurador?',
      answer: 'Por ley, es obligatorio en la gran mayoría de los procesos civiles (como divorcios contenciosos o reclamaciones de cantidad superiores a 2.000€) y penales. Sin embargo, más allá de la obligación legal, un procurador se necesita siempre que busques blindar tus plazos, agilizar la burocracia judicial y evitar que una notificación traspapelada arruine tu caso.',
      isOpen: false
    },
    {
      id: 2,
      question: '¿Qué es exactamente el "servicio integral" del despacho?',
      answer: 'Es control absoluto. No nos limitamos a reenviar correos; ejecutamos un seguimiento diario y exhaustivo de tus expedientes, controlamos los plazos al minuto, impulsamos activamente las ejecuciones judiciales y te acompañamos físicamente en cualquier comparecencia en Mallorca.',
      isOpen: false
    },
    {
      id: 3,
      question: '¿En qué consisten los Actos de Comunicación directos?',
      answer: 'Es la vía rápida. En lugar de esperar a que el saturado servicio común del juzgado notifique al demandado, lo hacemos nosotros directamente. Esto acorta notablemente la duración inicial de cualquier procedimiento y evita atascos burocráticos innecesarios.',
      isOpen: false
    },
    {
      id: 4,
      question: '¿Cuál es vuestro ámbito territorial de actuación?',
      answer: 'Nuestra presencia es inmediata en los Partidos Judiciales de Palma de Mallorca, Inca y Manacor. No obstante, damos cobertura en el resto de demarcaciones de las Islas Baleares bajo encargo previo del letrado.',
      isOpen: false
    },
    {
      id: 5,
      question: '¿Cómo se agiliza la gestión de trámites económicos y tasas?',
      answer: 'Con máxima diligencia. Nos encargamos por completo de la consignación de depósitos, la liquidación de tasas judiciales y la tramitación de despachos (oficios, mandamientos y exhortos) para que el abogado pueda centrarse exclusivamente en la estrategia de defensa.',
      isOpen: false
    }
  ];

  toggleFaq(faq: FAQItem) {
    faq.isOpen = !faq.isOpen;
  }
}

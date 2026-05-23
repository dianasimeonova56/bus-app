import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddTransportOperator } from "../add-transport-operator/add-transport-operator";
import { AddStop } from "../../stops/add-stop/add-stop";
import { AddRoute } from "../../routes/add-route/add-route";
import { EditRoute } from "../edit-route/edit-route";
import { AddSubscription } from "../add-subscription/add-subscription";
import { Verifications } from "../verifications/verifications";
import { AddNews } from "../add-news/add-news";

type AdminSectionId =
  | 'operators'
  | 'stops'
  | 'add-route'
  | 'edit-route'
  | 'subscriptions'
  | 'verifications'
  | 'news';

interface AdminSection {
  id: AdminSectionId;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-panel',
  imports: [
    FormsModule,
    AddTransportOperator,
    AddStop,
    AddRoute,
    EditRoute,
    AddSubscription,
    Verifications,
    AddNews,
  ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  readonly sections: AdminSection[] = [
    { id: 'operators',     label: 'Транспортни оператори', icon: 'bi-truck-front'      },
    { id: 'stops',         label: 'Спирки',                 icon: 'bi-geo-alt'          },
    { id: 'add-route',     label: 'Добавяне на маршрут',    icon: 'bi-signpost-split'   },
    { id: 'edit-route',    label: 'Редакция на маршрут',    icon: 'bi-pencil'           },
    { id: 'subscriptions', label: 'Абонаментни карти',     icon: 'bi-ticket-perforated' },
    { id: 'verifications', label: 'Верификации',            icon: 'bi-shield-check'     },
    { id: 'news',          label: 'Новини',                 icon: 'bi-newspaper'        },
  ];

  readonly selected = signal<AdminSectionId>('operators');

  select(id: AdminSectionId): void {
    this.selected.set(id);
    queueMicrotask(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  currentLabel(): string {
    return this.sections.find(s => s.id === this.selected())?.label ?? '';
  }
}

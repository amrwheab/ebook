import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzSpaceModule,
    NzNotificationModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzDividerModule,
    NzSelectModule,
    NzUploadModule,
    NzSwitchModule,
    NzMessageModule,
    NzModalModule,
    NzListModule,
    NzSpinModule,
    NzCardModule,
    NzPopoverModule,
    NzAvatarModule,
    NzSkeletonModule
  ],
  exports: [
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzSpaceModule,
    NzNotificationModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzDividerModule,
    NzSelectModule,
    NzUploadModule,
    NzSwitchModule,
    NzMessageModule,
    NzModalModule,
    NzListModule,
    NzSpinModule,
    NzCardModule,
    NzPopoverModule,
    NzAvatarModule,
    NzSkeletonModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }]
})
export class ZoroModule { }

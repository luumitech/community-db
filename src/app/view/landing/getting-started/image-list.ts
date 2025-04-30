import { type ImageProps } from 'next/image';
import DashboardImg from '../images/dashboard.png';
import ExportToXlsxImg from '../images/export-to-xlsx.png';
import MembershipEditorImg from '../images/membership-editor.png';
import occupantEditorImg from '../images/occupant-editor.png';
import PropertyDetailImg from '../images/property-detail.png';
import propertyListImg from '../images/property-list.png';

export interface SlideProps extends ImageProps {
  caption?: string;
}

export const imageList: SlideProps[] = [
  {
    alt: 'property-list',
    src: propertyListImg,
    caption: 'Easily search membership information within community',
  },
  {
    alt: 'property-detail',
    src: PropertyDetailImg,
    caption: 'Store and access membership information',
  },
  {
    alt: 'membership-editor',
    src: MembershipEditorImg,
    caption: 'Keep record of event attendance',
  },
  {
    alt: 'occupant-editor',
    src: occupantEditorImg,
    caption: 'Keep record of member contact information',
  },
  {
    alt: 'dashboard',
    src: DashboardImg,
    caption: 'Visualize membership information',
  },
  {
    alt: 'export-xlsx',
    src: ExportToXlsxImg,
    caption: 'Take entire database with you by exporting to Excel',
  },
];

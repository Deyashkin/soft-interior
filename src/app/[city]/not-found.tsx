import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Ошибка 404"
      title="Такой страницы нет"
      lead="Возможно, адрес изменился или страница была удалена. Загляните в портфолио или напишите нам — подскажем."
      actions={
        <>
          <Button href="/">На главную</Button>
          <Button href="/projects/" variant="link">
            Смотреть проекты
          </Button>
        </>
      }
    />
  );
}

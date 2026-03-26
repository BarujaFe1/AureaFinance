import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createCardPurchaseAction, createCreditCardAction } from "@/features/cards/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { getCardsSummary } from "@/services/cards.service";

export default function CardsPage() {
  const accounts = listAccounts();
  const categories = listCategories();
  const cards = getCardsSummary();

  return (
    <>
      <PageHeader title="Cartões" description="Cartões têm fechamento, vencimento, limite total, limite disponível, compras à vista e parceladas com geração explícita de parcelas." />
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Novo cartão</CardTitle></CardHeader>
          <CardContent>
            <form action={createCreditCardAction} className="grid gap-4 md:grid-cols-2">
              <Input name="name" placeholder="Nubank" />
              <Input name="limitAmount" placeholder="5000,00" />
              <Input name="brand" placeholder="Mastercard" />
              <Input name="network" placeholder="Gold, Black..." />
              <Input name="closeDay" type="number" placeholder="Dia fechamento" />
              <Input name="dueDay" type="number" placeholder="Dia vencimento" />
              <div className="md:col-span-2">
                <Select name="settlementAccountId">
                  <option value="">Selecione a conta de pagamento</option>
                  {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                </Select>
              </div>
              <div className="md:col-span-2 flex justify-end"><Button type="submit">Criar cartão</Button></div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Nova compra no cartão</CardTitle></CardHeader>
          <CardContent>
            <form action={createCardPurchaseAction} className="grid gap-4 md:grid-cols-2">
              <Select name="creditCardId">
                <option value="">Selecione o cartão</option>
                {cards.map((card) => <option key={card.id} value={card.id}>{card.name}</option>)}
              </Select>
              <Input name="description" placeholder="Monitor, SmartFit, tênis..." />
              <Input name="purchaseDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              <Input name="amount" placeholder="0,00" />
              <Input name="installmentCount" type="number" defaultValue={1} min={1} max={48} />
              <Select name="categoryId"><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select>
              <div className="md:col-span-2"><Input name="notes" placeholder="Observações da compra" /></div>
              <div className="md:col-span-2 flex justify-end"><Button type="submit">Lançar compra</Button></div>
            </form>
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Resumo dos cartões</CardTitle></CardHeader>
        <CardContent>
          {cards.length > 0 ? (
            <table>
              <thead><tr><th>Cartão</th><th>Fechamento</th><th>Vencimento</th><th>Limite</th><th>Usado</th><th>Disponível</th></tr></thead>
              <tbody>{cards.map((card) => <tr key={card.id}><td>{card.name}</td><td>Dia {card.closeDay}</td><td>Dia {card.dueDay}</td><td>{formatCurrencyFromCents(card.limitTotalCents)}</td><td>{formatCurrencyFromCents(card.usedCents)}</td><td>{formatCurrencyFromCents(card.availableLimitCents)}</td></tr>)}</tbody>
            </table>
          ) : (
            <EmptyState
              title="Nenhum cartão cadastrado"
              description="Esse vazio é legítimo quando a base ainda está no começo. Depois do primeiro cartão, o limite, o usado e o disponível aparecem aqui."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}

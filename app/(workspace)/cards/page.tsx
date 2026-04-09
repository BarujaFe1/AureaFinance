import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { archiveCreditCardAction, createCardPurchaseAction, createCreditCardAction, deleteCardPurchaseAction, restoreCreditCardAction, updateCardPurchaseAction, updateCreditCardAction } from "@/features/cards/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { getCardsSummary, listCreditCards } from "@/services/cards.service";

function centsToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

export default function CardsPage() {
  const accounts = listAccounts();
  const categories = listCategories();
  const cards = getCardsSummary();
  const archivedCards = listCreditCards(true).filter((card) => card.isArchived);

  return (
    <>
      <PageHeader title="Cartões" description="Cartões com fechamento, vencimento, limite total, compras à vista ou parceladas, edição manual e visão consolidada por entidade real." />
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Novo cartão</CardTitle></CardHeader>
          <CardContent>
            <form action={createCreditCardAction} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm"><span>Nome do cartão</span><Input name="name" placeholder="Nubank" /></label>
              <label className="grid gap-2 text-sm"><span>Limite total</span><Input name="limitAmount" placeholder="5000,00" /></label>
              <label className="grid gap-2 text-sm"><span>Bandeira</span><Input name="brand" placeholder="Mastercard" /></label>
              <label className="grid gap-2 text-sm"><span>Segmento / rede</span><Input name="network" placeholder="Gold, Black..." /></label>
              <label className="grid gap-2 text-sm"><span>Dia do fechamento</span><Input name="closeDay" type="number" placeholder="8" /></label>
              <label className="grid gap-2 text-sm"><span>Dia do vencimento</span><Input name="dueDay" type="number" placeholder="15" /></label>
              <div className="md:col-span-2"><label className="grid gap-2 text-sm"><span>Conta pagadora da fatura</span><Select name="settlementAccountId"><option value="">Selecione a conta de pagamento</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select></label></div>
              <div className="md:col-span-2 flex justify-end"><Button type="submit">Criar cartão</Button></div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Nova compra no cartão</CardTitle></CardHeader>
          <CardContent>
            <form action={createCardPurchaseAction} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm"><span>Cartão</span><Select name="creditCardId"><option value="">Selecione o cartão</option>{cards.map((card) => <option key={card.id} value={card.id}>{card.name}</option>)}</Select></label>
              <label className="grid gap-2 text-sm"><span>Descrição</span><Input name="description" placeholder="Monitor, SmartFit, tênis..." /></label>
              <label className="grid gap-2 text-sm"><span>Data da compra</span><Input name="purchaseDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
              <label className="grid gap-2 text-sm"><span>Valor total</span><Input name="amount" placeholder="0,00" /></label>
              <label className="grid gap-2 text-sm"><span>Número de parcelas</span><Input name="installmentCount" type="number" defaultValue={1} min={1} max={48} /></label>
              <label className="grid gap-2 text-sm"><span>Categoria</span><Select name="categoryId"><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></label>
              <div className="md:col-span-2"><label className="grid gap-2 text-sm"><span>Observações</span><Input name="notes" placeholder="Observações da compra" /></label></div>
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
              <thead><tr><th>Cartão</th><th>Fechamento</th><th>Vencimento</th><th>Limite</th><th>Usado</th><th>Disponível</th><th>Próxima fatura</th></tr></thead>
              <tbody>{cards.map((card) => <tr key={card.id}><td>{card.name}{card.duplicateCount ? <span className="ml-2 text-xs text-[var(--muted-foreground)]">dados consolidados de {card.duplicateCount + 1} cadastros equivalentes</span> : null}</td><td>Dia {card.closeDay}</td><td>Dia {card.dueDay}</td><td>{formatCurrencyFromCents(card.limitTotalCents)}</td><td>{formatCurrencyFromCents(card.usedCents)}</td><td>{formatCurrencyFromCents(card.availableLimitCents)}{card.isOverLimit ? <span className="ml-2 text-xs text-red-500">acima do limite</span> : null}</td><td>{card.nextBill ? `${card.nextBill.billMonth} · ${formatCurrencyFromCents(Math.max(card.nextBill.totalAmountCents - card.nextBill.paidAmountCents, 0))}` : "—"}</td></tr>)}</tbody>
            </table>
          ) : <EmptyState title="Nenhum cartão cadastrado" description="Cadastre o primeiro cartão ou use o bootstrap/import para consolidar limite, usado, disponível e próxima fatura." />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Editar cartões e compras</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {cards.map((card) => (
            <details key={card.id} className="rounded-2xl border border-[var(--border)] p-4">
              <summary className="cursor-pointer text-sm font-medium">{card.name}</summary>
              <form action={updateCreditCardAction} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <input type="hidden" name="cardId" value={card.id} />
                <label className="grid gap-2 text-sm"><span>Nome</span><Input name="name" defaultValue={card.name} /></label>
                <label className="grid gap-2 text-sm"><span>Bandeira</span><Input name="brand" defaultValue={card.brand ?? ""} /></label>
                <label className="grid gap-2 text-sm"><span>Rede</span><Input name="network" defaultValue={card.network ?? ""} /></label>
                <label className="grid gap-2 text-sm"><span>Limite</span><Input name="limitAmount" defaultValue={centsToInput(card.limitTotalCents)} /></label>
                <label className="grid gap-2 text-sm"><span>Fechamento</span><Input name="closeDay" type="number" defaultValue={card.closeDay} /></label>
                <label className="grid gap-2 text-sm"><span>Vencimento</span><Input name="dueDay" type="number" defaultValue={card.dueDay} /></label>
                <label className="grid gap-2 text-sm"><span>Conta pagadora</span><Select name="settlementAccountId" defaultValue={card.settlementAccountId}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select></label>
                <label className="grid gap-2 text-sm"><span>Cor</span><Input name="color" type="color" defaultValue={card.color ?? "#111827"} /></label>
                <div className="xl:col-span-4 flex justify-end gap-2"><Button type="submit">Salvar cartão</Button></div>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={archiveCreditCardAction}><input type="hidden" name="cardId" value={card.id} /><Button type="submit" className="h-8 px-3 text-xs">Arquivar cartão</Button></form>
              </div>
              {card.purchases.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {card.purchases.map((purchase) => (
                    <details key={purchase.id} className="rounded-xl border border-[var(--border)] p-3">
                      <summary className="cursor-pointer text-sm">{purchase.description} · {formatCurrencyFromCents(purchase.totalAmountCents)}</summary>
                      <form action={updateCardPurchaseAction} className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <input type="hidden" name="purchaseId" value={purchase.id} />
                        <label className="grid gap-2 text-sm"><span>Cartão</span><Select name="creditCardId" defaultValue={purchase.creditCardId}>{cards.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></label>
                        <label className="grid gap-2 text-sm"><span>Descrição</span><Input name="description" defaultValue={purchase.description} /></label>
                        <label className="grid gap-2 text-sm"><span>Data</span><Input name="purchaseDate" type="date" defaultValue={purchase.purchaseDate} /></label>
                        <label className="grid gap-2 text-sm"><span>Valor</span><Input name="amount" defaultValue={centsToInput(purchase.totalAmountCents)} /></label>
                        <label className="grid gap-2 text-sm"><span>Parcelas</span><Input name="installmentCount" type="number" min={1} max={48} defaultValue={purchase.installmentCount} /></label>
                        <label className="grid gap-2 text-sm"><span>Categoria</span><Select name="categoryId" defaultValue={purchase.categoryId ?? ""}><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></label>
                        <label className="grid gap-2 text-sm xl:col-span-2"><span>Notas</span><Input name="notes" defaultValue={purchase.notes ?? ""} /></label>
                        <div className="xl:col-span-4 flex justify-end gap-2"><Button type="submit">Salvar compra</Button></div>
                      </form>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <form action={deleteCardPurchaseAction}><input type="hidden" name="purchaseId" value={purchase.id} /><Button type="submit" className="h-8 px-3 text-xs">Excluir compra</Button></form>
                      </div>
                    </details>
                  ))}
                </div>
              ) : null}
            </details>
          ))}
          {archivedCards.length > 0 ? (
            <details className="rounded-2xl border border-[var(--border)] p-4">
              <summary className="cursor-pointer text-sm font-medium">Cartões arquivados ({archivedCards.length})</summary>
              <div className="mt-4 space-y-2">
                {archivedCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-3 text-sm">
                    <span>{card.name}</span>
                    <form action={restoreCreditCardAction}><input type="hidden" name="cardId" value={card.id} /><Button type="submit" className="h-8 px-3 text-xs">Restaurar</Button></form>
                  </div>
                ))}
              </div>
            </details>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountForm } from "@/features/accounts/account-form";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccountsWithBalances } from "@/services/accounts.service";

export default function AccountsPage() {
  const accounts = listAccountsWithBalances();

  return (
    <>
      <PageHeader
        title="Contas"
        description="Contas correntes, poupanças, reservas e contas pagadoras de fatura com saldo atual e saldo projetado."
      />
      <AccountForm />
      <Card>
        <CardHeader>
          <CardTitle>Resumo por conta</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Conta</th>
                  <th>Instituição</th>
                  <th>Tipo</th>
                  <th>Saldo atual</th>
                  <th>Saldo projetado</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.name}</td>
                    <td>{account.institution || "—"}</td>
                    <td>{account.type}</td>
                    <td>{formatCurrencyFromCents(account.currentBalanceCents)}</td>
                    <td>{formatCurrencyFromCents(account.projectedBalanceCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="Nenhuma conta cadastrada"
              description="Crie a primeira conta ou importe sua base. Quando existir conta, os saldos serão calculados a partir do opening balance e das transações vinculadas."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}

import AppLayout from "../../components/AppLayout"
import { WalletSetup } from "../../components/wallet/WalletSetup"
import { ComponentWithAuth } from "../../components/ComponentWithAuth"

const RollPage: ComponentWithAuth = () => (
  <AppLayout>
    <h1>hi</h1>
  </AppLayout>
)

RollPage.requireAuth = true
export default RollPage
import {Observer, PrimaryExtensionMediator} from "@src/pages/background/mediator"
import {ConsoleLogger} from "@src/shared/ConsoleLogger";

const logger = ConsoleLogger.getInstance();

export enum Urls {
  inform_url = `/v2/chrome/consumer/ext-uninstall-inform`,
  cancel_url = `/v2/chrome/consumer/ext-uninstall-cancel`
}

export class EmailService implements Observer {

  private notifyParents(jwtToken: string) {
    const apiUrl = import.meta.env.API_URL;
    fetch(`${apiUrl}${Urls.inform_url}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${jwtToken}`
      }
    })
  }

  private revokeNotifyParents(jwtToken: string) {
    const apiUrl = import.meta.env.API_URL;
    fetch(`${apiUrl}${Urls.cancel_url}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${jwtToken}`
      }
    })
  }

  public update = async (monitoringExtensionMediator: PrimaryExtensionMediator, reason?: string) => {
    if (!monitoringExtensionMediator.isConnected && await monitoringExtensionMediator.jwtToken !== "") {
      logger.info(`NOTIFYING PARENTS!`)
      this.notifyParents(await monitoringExtensionMediator.jwtToken);
    } else if (monitoringExtensionMediator.isConnected && await monitoringExtensionMediator.jwtToken !== "" && reason === "update") {
      logger.info(`REVOKING NOTIFICATION!`)
      this.revokeNotifyParents(await monitoringExtensionMediator.jwtToken);

    }
  }
}

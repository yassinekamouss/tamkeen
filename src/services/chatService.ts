import api from "../api/axios";

export class TamkeenChatService {
  private static instance: TamkeenChatService;
  private conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];

  public static getInstance(): TamkeenChatService {
    if (!TamkeenChatService.instance) {
      TamkeenChatService.instance = new TamkeenChatService();
    }
    return TamkeenChatService.instance;
  }

  public resetConversation() {
    this.conversationHistory = [];
  }

  public async sendMessage(
    userMessage: string,
    quickAction?: string
  ): Promise<string> {
    try {
      // Construire le message selon le quickAction
      let actualMessage = userMessage;

      if (quickAction) {
        switch (quickAction) {
          case "info_tamkeen":
            actualMessage =
              "Pouvez-vous me parler de Tamkeen ? Qui êtes-vous et quelle est votre mission ?";
            break;
          case "info_programmes":
            actualMessage =
              "Quels sont les programmes de subventions disponibles chez Tamkeen ?";
            break;
          case "test_eligibilite":
            actualMessage =
              "Je souhaite faire un test d'éligibilité pour savoir si je peux bénéficier d'un programme de subvention.";
            break;
          case "contact":
            actualMessage =
              "Comment puis-je vous contacter pour avoir plus d'informations ?";
            break;
        }
      }

      // Ajouter le message de l'utilisateur à l'historique
      this.conversationHistory.push({ role: "user", content: actualMessage });

      // Appel au backend sécurisé
      const { data } = await api.post("/chat", {
        message: actualMessage,
        history: this.conversationHistory.slice(-9),
      });

      const response: string =
        data?.response || "Désolé, je n'ai pas pu traiter votre demande.";

      // Ajouter la réponse à l'historique
      this.conversationHistory.push({ role: "assistant", content: response });

      // Limiter l'historique à 10 messages pour éviter les tokens excessifs
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return response;
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants ou remplissez notre formulaire pour qu'un consultant vous contacte.";
    }
  }
}

export default TamkeenChatService;

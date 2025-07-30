export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      _ContactToContactTag: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_ContactToContactTag_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_ContactToContactTag_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "ContactTag"
            referencedColumns: ["id"]
          },
        ]
      }
      Account: {
        Row: {
          access_token: string | null
          createdAt: string
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          updatedAt: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          createdAt?: string
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          updatedAt: string
          userId: string
        }
        Update: {
          access_token?: string | null
          createdAt?: string
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ApiKey: {
        Row: {
          createdAt: string
          description: string
          expiresAt: string | null
          hashedKey: string
          id: string
          lastUsedAt: string | null
          organizationId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description: string
          expiresAt?: string | null
          hashedKey: string
          id: string
          lastUsedAt?: string | null
          organizationId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string
          expiresAt?: string | null
          hashedKey?: string
          id?: string
          lastUsedAt?: string | null
          organizationId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ApiKey_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      AuthenticatorApp: {
        Row: {
          accountName: string
          createdAt: string
          id: string
          issuer: string
          recoveryCodes: string
          secret: string
          updatedAt: string
          userId: string
        }
        Insert: {
          accountName: string
          createdAt?: string
          id: string
          issuer: string
          recoveryCodes: string
          secret: string
          updatedAt: string
          userId: string
        }
        Update: {
          accountName?: string
          createdAt?: string
          id?: string
          issuer?: string
          recoveryCodes?: string
          secret?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "AuthenticatorApp_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ChangeEmailRequest: {
        Row: {
          createdAt: string
          email: string
          expires: string
          id: string
          updatedAt: string
          userId: string
          valid: boolean
        }
        Insert: {
          createdAt?: string
          email: string
          expires: string
          id: string
          updatedAt: string
          userId: string
          valid?: boolean
        }
        Update: {
          createdAt?: string
          email?: string
          expires?: string
          id?: string
          updatedAt?: string
          userId?: string
          valid?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ChangeEmailRequest_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string
          notes: string | null
          owner_id: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
        }
        Relationships: []
      }
      Contact: {
        Row: {
          address: string | null
          createdAt: string
          email: string | null
          id: string
          image: string | null
          name: string
          organizationId: string
          phone: string | null
          record: Database["public"]["Enums"]["ContactRecord"]
          stage: Database["public"]["Enums"]["ContactStage"]
          updatedAt: string
        }
        Insert: {
          address?: string | null
          createdAt?: string
          email?: string | null
          id: string
          image?: string | null
          name: string
          organizationId: string
          phone?: string | null
          record?: Database["public"]["Enums"]["ContactRecord"]
          stage?: Database["public"]["Enums"]["ContactStage"]
          updatedAt: string
        }
        Update: {
          address?: string | null
          createdAt?: string
          email?: string | null
          id?: string
          image?: string | null
          name?: string
          organizationId?: string
          phone?: string | null
          record?: Database["public"]["Enums"]["ContactRecord"]
          stage?: Database["public"]["Enums"]["ContactStage"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Contact_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactActivity: {
        Row: {
          actionType: Database["public"]["Enums"]["ActionType"]
          actorId: string
          actorType: Database["public"]["Enums"]["ActorType"]
          contactId: string
          id: string
          metadata: Json | null
          occurredAt: string
        }
        Insert: {
          actionType: Database["public"]["Enums"]["ActionType"]
          actorId: string
          actorType: Database["public"]["Enums"]["ActorType"]
          contactId: string
          id: string
          metadata?: Json | null
          occurredAt?: string
        }
        Update: {
          actionType?: Database["public"]["Enums"]["ActionType"]
          actorId?: string
          actorType?: Database["public"]["Enums"]["ActorType"]
          contactId?: string
          id?: string
          metadata?: Json | null
          occurredAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ContactActivity_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactComment: {
        Row: {
          contactId: string
          createdAt: string
          id: string
          text: string
          updatedAt: string
          userId: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          id: string
          text: string
          updatedAt: string
          userId: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          id?: string
          text?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ContactComment_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactComment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactImage: {
        Row: {
          contactId: string
          contentType: string | null
          data: string | null
          hash: string | null
          id: string
        }
        Insert: {
          contactId: string
          contentType?: string | null
          data?: string | null
          hash?: string | null
          id: string
        }
        Update: {
          contactId?: string
          contentType?: string | null
          data?: string | null
          hash?: string | null
          id?: string
        }
        Relationships: []
      }
      ContactNote: {
        Row: {
          contactId: string
          createdAt: string
          id: string
          text: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          id: string
          text?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          id?: string
          text?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ContactNote_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactNote_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactPageVisit: {
        Row: {
          contactId: string
          id: string
          timestamp: string
          userId: string | null
        }
        Insert: {
          contactId: string
          id: string
          timestamp?: string
          userId?: string | null
        }
        Update: {
          contactId?: string
          id?: string
          timestamp?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ContactPageVisit_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactPageVisit_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactTag: {
        Row: {
          id: string
          text: string
        }
        Insert: {
          id: string
          text: string
        }
        Update: {
          id?: string
          text?: string
        }
        Relationships: []
      }
      ContactTask: {
        Row: {
          contactId: string
          createdAt: string
          description: string | null
          dueDate: string | null
          id: string
          status: Database["public"]["Enums"]["ContactTaskStatus"]
          title: string
          updatedAt: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          description?: string | null
          dueDate?: string | null
          id: string
          status?: Database["public"]["Enums"]["ContactTaskStatus"]
          title: string
          updatedAt: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          description?: string | null
          dueDate?: string | null
          id?: string
          status?: Database["public"]["Enums"]["ContactTaskStatus"]
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ContactTask_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
        ]
      }
      Favorite: {
        Row: {
          contactId: string
          id: string
          order: number
          userId: string
        }
        Insert: {
          contactId: string
          id: string
          order?: number
          userId: string
        }
        Update: {
          contactId?: string
          id?: string
          order?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Favorite_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Favorite_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Feedback: {
        Row: {
          category: Database["public"]["Enums"]["FeedbackCategory"]
          createdAt: string
          id: string
          message: string
          organizationId: string
          updatedAt: string
          userId: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["FeedbackCategory"]
          createdAt?: string
          id: string
          message: string
          organizationId: string
          updatedAt: string
          userId?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["FeedbackCategory"]
          createdAt?: string
          id?: string
          message?: string
          organizationId?: string
          updatedAt?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Feedback_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Feedback_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Invitation: {
        Row: {
          createdAt: string
          email: string
          id: string
          lastSentAt: string | null
          organizationId: string
          role: Database["public"]["Enums"]["Role"]
          status: Database["public"]["Enums"]["InvitationStatus"]
          token: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          lastSentAt?: string | null
          organizationId: string
          role?: Database["public"]["Enums"]["Role"]
          status?: Database["public"]["Enums"]["InvitationStatus"]
          token: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          lastSentAt?: string | null
          organizationId?: string
          role?: Database["public"]["Enums"]["Role"]
          status?: Database["public"]["Enums"]["InvitationStatus"]
          token?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Invitation_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      Membership: {
        Row: {
          createdAt: string
          id: string
          isOwner: boolean
          organizationId: string
          role: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          isOwner?: boolean
          organizationId: string
          role?: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          isOwner?: boolean
          organizationId?: string
          role?: Database["public"]["Enums"]["Role"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Membership_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Membership_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Notification: {
        Row: {
          content: string
          createdAt: string
          dismissed: boolean
          id: string
          link: string | null
          seenAt: string | null
          subject: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          dismissed?: boolean
          id: string
          link?: string | null
          seenAt?: string | null
          subject?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          dismissed?: boolean
          id?: string
          link?: string | null
          seenAt?: string | null
          subject?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Notification_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Order: {
        Row: {
          createdAt: string
          currency: string
          id: string
          organizationId: string
          provider: string
          status: string
          totalAmount: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          currency: string
          id: string
          organizationId: string
          provider: string
          status: string
          totalAmount?: number
          updatedAt: string
        }
        Update: {
          createdAt?: string
          currency?: string
          id?: string
          organizationId?: string
          provider?: string
          status?: string
          totalAmount?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Order_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      OrderItem: {
        Row: {
          id: string
          model: string | null
          orderId: string
          priceAmount: number | null
          productId: string
          quantity: number
          type: string | null
          variantId: string
        }
        Insert: {
          id: string
          model?: string | null
          orderId: string
          priceAmount?: number | null
          productId: string
          quantity: number
          type?: string | null
          variantId: string
        }
        Update: {
          id?: string
          model?: string | null
          orderId?: string
          priceAmount?: number | null
          productId?: string
          quantity?: number
          type?: string | null
          variantId?: string
        }
        Relationships: [
          {
            foreignKeyName: "OrderItem_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      Organization: {
        Row: {
          address: string | null
          billingCity: string | null
          billingCountry: string | null
          billingCustomerId: string | null
          billingEmail: string | null
          billingLine1: string | null
          billingLine2: string | null
          billingPostalCode: string | null
          billingState: string | null
          email: string | null
          facebookPage: string | null
          id: string
          instagramProfile: string | null
          linkedInProfile: string | null
          logo: string | null
          name: string
          phone: string | null
          slug: string
          tikTokProfile: string | null
          website: string | null
          xProfile: string | null
          youTubeChannel: string | null
        }
        Insert: {
          address?: string | null
          billingCity?: string | null
          billingCountry?: string | null
          billingCustomerId?: string | null
          billingEmail?: string | null
          billingLine1?: string | null
          billingLine2?: string | null
          billingPostalCode?: string | null
          billingState?: string | null
          email?: string | null
          facebookPage?: string | null
          id: string
          instagramProfile?: string | null
          linkedInProfile?: string | null
          logo?: string | null
          name: string
          phone?: string | null
          slug: string
          tikTokProfile?: string | null
          website?: string | null
          xProfile?: string | null
          youTubeChannel?: string | null
        }
        Update: {
          address?: string | null
          billingCity?: string | null
          billingCountry?: string | null
          billingCustomerId?: string | null
          billingEmail?: string | null
          billingLine1?: string | null
          billingLine2?: string | null
          billingPostalCode?: string | null
          billingState?: string | null
          email?: string | null
          facebookPage?: string | null
          id?: string
          instagramProfile?: string | null
          linkedInProfile?: string | null
          logo?: string | null
          name?: string
          phone?: string | null
          slug?: string
          tikTokProfile?: string | null
          website?: string | null
          xProfile?: string | null
          youTubeChannel?: string | null
        }
        Relationships: []
      }
      OrganizationLogo: {
        Row: {
          contentType: string | null
          data: string | null
          hash: string | null
          id: string
          organizationId: string
        }
        Insert: {
          contentType?: string | null
          data?: string | null
          hash?: string | null
          id: string
          organizationId: string
        }
        Update: {
          contentType?: string | null
          data?: string | null
          hash?: string | null
          id?: string
          organizationId?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          completedOnboarding: boolean
          createdAt: string
          email: string | null
          emailVerified: string | null
          enabledContactsNotifications: boolean
          enabledInboxNotifications: boolean
          enabledNewsletter: boolean
          enabledProductUpdates: boolean
          enabledWeeklySummary: boolean
          id: string
          image: string | null
          lastLogin: string | null
          locale: string
          name: string
          password: string | null
          phone: string | null
          updatedAt: string
        }
        Insert: {
          completedOnboarding?: boolean
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          enabledContactsNotifications?: boolean
          enabledInboxNotifications?: boolean
          enabledNewsletter?: boolean
          enabledProductUpdates?: boolean
          enabledWeeklySummary?: boolean
          id: string
          image?: string | null
          lastLogin?: string | null
          locale?: string
          name: string
          password?: string | null
          phone?: string | null
          updatedAt: string
        }
        Update: {
          completedOnboarding?: boolean
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          enabledContactsNotifications?: boolean
          enabledInboxNotifications?: boolean
          enabledNewsletter?: boolean
          enabledProductUpdates?: boolean
          enabledWeeklySummary?: boolean
          id?: string
          image?: string | null
          lastLogin?: string | null
          locale?: string
          name?: string
          password?: string | null
          phone?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      ResetPasswordRequest: {
        Row: {
          createdAt: string
          email: string
          expires: string
          id: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          expires: string
          id: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          expires?: string
          id?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Session: {
        Row: {
          createdAt: string
          expires: string
          id: string
          sessionToken: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          expires: string
          id: string
          sessionToken: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          expires?: string
          id?: string
          sessionToken?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscription: {
        Row: {
          active: boolean
          cancelAtPeriodEnd: boolean
          createdAt: string
          currency: string
          id: string
          organizationId: string
          periodEndsAt: string
          periodStartsAt: string
          provider: string
          status: string
          trialEndsAt: string | null
          trialStartsAt: string | null
          updatedAt: string
        }
        Insert: {
          active?: boolean
          cancelAtPeriodEnd?: boolean
          createdAt?: string
          currency: string
          id: string
          organizationId: string
          periodEndsAt: string
          periodStartsAt: string
          provider: string
          status: string
          trialEndsAt?: string | null
          trialStartsAt?: string | null
          updatedAt: string
        }
        Update: {
          active?: boolean
          cancelAtPeriodEnd?: boolean
          createdAt?: string
          currency?: string
          id?: string
          organizationId?: string
          periodEndsAt?: string
          periodStartsAt?: string
          provider?: string
          status?: string
          trialEndsAt?: string | null
          trialStartsAt?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Subscription_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      SubscriptionItem: {
        Row: {
          id: string
          interval: string
          intervalCount: number
          model: string | null
          priceAmount: number | null
          productId: string
          quantity: number
          subscriptionId: string
          type: string | null
          variantId: string
        }
        Insert: {
          id: string
          interval: string
          intervalCount: number
          model?: string | null
          priceAmount?: number | null
          productId: string
          quantity: number
          subscriptionId: string
          type?: string | null
          variantId: string
        }
        Update: {
          id?: string
          interval?: string
          intervalCount?: number
          model?: string | null
          priceAmount?: number | null
          productId?: string
          quantity?: number
          subscriptionId?: string
          type?: string | null
          variantId?: string
        }
        Relationships: [
          {
            foreignKeyName: "SubscriptionItem_subscriptionId_fkey"
            columns: ["subscriptionId"]
            isOneToOne: false
            referencedRelation: "Subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      UserImage: {
        Row: {
          contentType: string | null
          data: string | null
          hash: string | null
          id: string
          userId: string
        }
        Insert: {
          contentType?: string | null
          data?: string | null
          hash?: string | null
          id: string
          userId: string
        }
        Update: {
          contentType?: string | null
          data?: string | null
          hash?: string | null
          id?: string
          userId?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          id: string
          role: string
        }
        Insert: {
          email?: string | null
          id: string
          role: string
        }
        Update: {
          email?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
      Webhook: {
        Row: {
          createdAt: string
          id: string
          organizationId: string
          secret: string | null
          triggers: Database["public"]["Enums"]["WebhookTrigger"][] | null
          updatedAt: string
          url: string
        }
        Insert: {
          createdAt?: string
          id: string
          organizationId: string
          secret?: string | null
          triggers?: Database["public"]["Enums"]["WebhookTrigger"][] | null
          updatedAt: string
          url: string
        }
        Update: {
          createdAt?: string
          id?: string
          organizationId?: string
          secret?: string | null
          triggers?: Database["public"]["Enums"]["WebhookTrigger"][] | null
          updatedAt?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Webhook_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      WorkHours: {
        Row: {
          dayOfWeek: Database["public"]["Enums"]["DayOfWeek"]
          id: string
          organizationId: string
        }
        Insert: {
          dayOfWeek?: Database["public"]["Enums"]["DayOfWeek"]
          id: string
          organizationId: string
        }
        Update: {
          dayOfWeek?: Database["public"]["Enums"]["DayOfWeek"]
          id?: string
          organizationId?: string
        }
        Relationships: [
          {
            foreignKeyName: "WorkHours_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      WorkTimeSlot: {
        Row: {
          end: string
          id: string
          start: string
          workHoursId: string
        }
        Insert: {
          end: string
          id: string
          start: string
          workHoursId: string
        }
        Update: {
          end?: string
          id?: string
          start?: string
          workHoursId?: string
        }
        Relationships: [
          {
            foreignKeyName: "WorkTimeSlot_workHoursId_fkey"
            columns: ["workHoursId"]
            isOneToOne: false
            referencedRelation: "WorkHours"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ActionType: "create" | "update" | "delete"
      ActorType: "system" | "member" | "api"
      ContactRecord: "person" | "company"
      ContactStage:
        | "lead"
        | "qualified"
        | "opportunity"
        | "proposal"
        | "inNegotiation"
        | "lost"
        | "won"
      ContactTaskStatus: "open" | "completed"
      DayOfWeek:
        | "sunday"
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
      FeedbackCategory: "suggestion" | "problem" | "question"
      InvitationStatus: "pending" | "accepted" | "revoked"
      Role: "member" | "admin"
      WebhookTrigger: "contactCreated" | "contactUpdated" | "contactDeleted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ActionType: ["create", "update", "delete"],
      ActorType: ["system", "member", "api"],
      ContactRecord: ["person", "company"],
      ContactStage: [
        "lead",
        "qualified",
        "opportunity",
        "proposal",
        "inNegotiation",
        "lost",
        "won",
      ],
      ContactTaskStatus: ["open", "completed"],
      DayOfWeek: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      FeedbackCategory: ["suggestion", "problem", "question"],
      InvitationStatus: ["pending", "accepted", "revoked"],
      Role: ["member", "admin"],
      WebhookTrigger: ["contactCreated", "contactUpdated", "contactDeleted"],
    },
  },
} as const

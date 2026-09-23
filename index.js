const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder
} = require("discord.js");

// ===============================
// TIXORA
// ===============================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

// ===============================
// SETTINGS
// ===============================

const BOT_NAME = "Tixora";
const SUPPORT_SERVER = "https://discord.gg/HuJnqstD8";

// التوكن يكون في إعدادات الاستضافة
const TOKEN = process.env.TOKEN;

// ===============================
// READY
// ===============================

client.once("ready", async () => {
  console.log(`✅ ${BOT_NAME} is online`);
  console.log(`🤖 Logged in as: ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: "Ticket System 🎫",
        type: 3
      }
    ],
    status: "online"
  });

  // ===============================
  // COMMANDS
  // ===============================

  const commands = [

    new SlashCommandBuilder()
      .setName("ticket")
      .setDescription("إدارة نظام التذاكر")

      .addSubcommand(sub =>
        sub
          .setName("setup")
          .setDescription("إنشاء لوحة التذاكر")
      )

      .addSubcommand(sub =>
        sub
          .setName("close")
          .setDescription("إغلاق التذكرة الحالية")
      )

      .addSubcommand(sub =>
        sub
          .setName("delete")
          .setDescription("حذف التذكرة الحالية")
      )

      .addSubcommand(sub =>
        sub
          .setName("claim")
          .setDescription("استلام التذكرة")
      )

      .addSubcommand(sub =>
        sub
          .setName("unclaim")
          .setDescription("إلغاء استلام التذكرة")
      )

      .addSubcommand(sub =>
        sub
          .setName("add")
          .setDescription("إضافة عضو للتذكرة")
          .addUserOption(option =>
            option
              .setName("user")
              .setDescription("العضو")
              .setRequired(true)
          )
      )

      .addSubcommand(sub =>
        sub
          .setName("remove")
          .setDescription("إزالة عضو من التذكرة")
          .addUserOption(option =>
            option
              .setName("user")
              .setDescription("العضو")
              .setRequired(true)
          )
      )

      .addSubcommand(sub =>
        sub
          .setName("rename")
          .setDescription("تغيير اسم التذكرة")
          .addStringOption(option =>
            option
              .setName("name")
              .setDescription("الاسم الجديد")
              .setRequired(true)
          )
      ),

    new SlashCommandBuilder()
      .setName("support")
      .setDescription("رابط الدعم الفني")

  ];

  await client.application.commands.set(
    commands.map(command => command.toJSON())
  );

  console.log("✅ Commands registered");
});

// ===============================
// INTERACTIONS
// ===============================

client.on("interactionCreate", async interaction => {

  if (!interaction.isChatInputCommand()) return;

  // ===============================
  // SUPPORT
  // ===============================

  if (interaction.commandName === "support") {

    return interaction.reply({
      content:
        `🎫 **Tixora Support**\n` +
        `${SUPPORT_SERVER}`,
      ephemeral: true
    });
  }

  // ===============================
  // TICKET
  // ===============================

  if (interaction.commandName !== "ticket") return;

  const subcommand = interaction.options.getSubcommand();

  // ===============================
  // SETUP
  // ===============================

  if (subcommand === "setup") {

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content: "❌ تحتاج إلى صلاحية Administrator.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("🎫 Tixora Ticket System")
      .setDescription(
        "للتواصل مع فريق الدعم، اضغط على الزر بالأسفل لفتح تذكرة.\n\n" +
        "سيتم إنشاء قناة خاصة بك تلقائيًا."
      )
      .setFooter({
        text: "Tixora Ticket System"
      });

    const row = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setCustomId("tixora_create_ticket")
        .setLabel("فتح تذكرة")
        .setEmoji("🎫")
        .setStyle(ButtonStyle.Primary)

    );

    await interaction.channel.send({
      embeds: [embed],
      components: [row]
    });

    return interaction.reply({
      content: "✅ تم إنشاء لوحة Tixora.",
      ephemeral: true
    });
  }

  // ===============================
  // CLOSE
  // ===============================

  if (subcommand === "close") {

    if (
      interaction.channel.type !== ChannelType.GuildText
    ) {
      return interaction.reply({
        content: "❌ هذا الأمر يعمل داخل التذاكر فقط.",
        ephemeral: true
      });
    }

    await interaction.reply("🔒 سيتم إغلاق التذكرة...");

    setTimeout(async () => {

      try {
        await interaction.channel.delete();
      } catch (error) {
        console.log(error);
      }

    }, 3000);

    return;
  }

  // ===============================
  // DELETE
  // ===============================

  if (subcommand === "delete") {

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    ) {
      return interaction.reply({
        content: "❌ تحتاج إلى Manage Channels.",
        ephemeral: true
      });
    }

    await interaction.reply("🗑️ سيتم حذف التذكرة...");

    setTimeout(async () => {

      try {
        await interaction.channel.delete();
      } catch (error) {
        console.log(error);
      }

    }, 2000);

    return;
  }

  // ===============================
  // CLAIM
  // ===============================

  if (subcommand === "claim") {

    return interaction.reply({
      content: `🎫 تم استلام التذكرة بواسطة ${interaction.user}.`
    });
  }

  // ===============================
  // UNCLAIM
  // ===============================

  if (subcommand === "unclaim") {

    return interaction.reply({
      content: `↩️ تم إلغاء استلام التذكرة بواسطة ${interaction.user}.`
    });
  }

  // ===============================
  // ADD
  // ===============================

  if (subcommand === "add") {

    const user = interaction.options.getUser("user");

    await interaction.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true
    });

    return interaction.reply({
      content: `✅ تمت إضافة ${user} إلى التذكرة.`
    });
  }

  // ===============================
  // REMOVE
  // ===============================

  if (subcommand === "remove") {

    const user = interaction.options.getUser("user");

    await interaction.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: false
    });

    return interaction.reply({
      content: `✅ تمت إزالة ${user} من التذكرة.`
    });
  }

  // ===============================
  // RENAME
  // ===============================

  if (subcommand === "rename") {

    const name = interaction.options.getString("name");

    await interaction.channel.setName(name);

    return interaction.reply({
      content: `✅ تم تغيير اسم التذكرة إلى \`${name}\`.`
    });
  }

});

// ===============================
// BUTTONS
// ===============================

client.on("interactionCreate", async interaction => {

  if (!interaction.isButton()) return;

  if (interaction.customId !== "tixora_create_ticket") return;

  const guild = interaction.guild;
  const member = interaction.member;

  const existingTicket = guild.channels.cache.find(
    channel =>
      channel.type === ChannelType.GuildText &&
      channel.topic === `ticket-owner:${member.id}`
  );

  if (existingTicket) {

    return interaction.reply({
      content: `❌ لديك تذكرة مفتوحة بالفعل: ${existingTicket}`,
      ephemeral: true
    });
  }

  const ticket = await guild.channels.create({
    name: `ticket-${member.user.username}`,
    type: ChannelType.GuildText,

    topic: `ticket-owner:${member.id}`,

    permissionOverwrites: [

      {
        id: guild.roles.everyone.id,
        deny: [
          PermissionsBitField.Flags.ViewChannel
        ]
      },

      {
        id: member.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      }

    ]
  });

  const embed = new EmbedBuilder()
    .setTitle("🎫 Tixora Ticket")
    .setDescription(
      `مرحبًا ${member}!\n\n` +
      "اكتب مشكلتك أو استفسارك هنا، وسيقوم فريق الدعم بمساعدتك."
    )
    .setFooter({
      text: "Tixora Ticket System"
    });

  const row = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId("tixora_close_ticket")
      .setLabel("إغلاق التذكرة")
      .setEmoji("🔒")
      .setStyle(ButtonStyle.Danger)

  );

  await ticket.send({
    content: `${member}`,
    embeds: [embed],
    components: [row]
  });

  return interaction.reply({
    content: `✅ تم إنشاء تذكرتك: ${ticket}`,
    ephemeral: true
  });
});

// ===============================
// CLOSE BUTTON
// ===============================

client.on("interactionCreate", async interaction => {

  if (!interaction.isButton()) return;

  if (interaction.customId !== "tixora_close_ticket") return;

  await interaction.reply("🔒 سيتم إغلاق التذكرة...");

  setTimeout(async () => {

    try {
      await interaction.channel.delete();
    } catch (error) {
      console.log(error);
    }

  }, 3000);
});

// ===============================
// LOGIN
// ===============================

if (!TOKEN) {
  console.error("❌ TOKEN غير موجود في Environment Variables");
  process.exit(1);
}

client.login(TOKEN);

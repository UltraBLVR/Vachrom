module.exports = {
    name: 'dice',
    description: 'Roll a dice',
    execute(message, args) {
        const sides = parseInt(args[0]) || 6;
        if (sides < 2 || sides > 100) return message.reply('Dice must have 2-100 sides!');
        
        const result = Math.floor(Math.random() * sides) + 1;
        message.reply(`🎲 You rolled a ${result} (1-${sides})`);
    }
};
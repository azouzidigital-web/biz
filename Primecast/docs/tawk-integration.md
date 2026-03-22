# Tawk.to Live Chat Integration Guide

This document explains how to set up and customize the Tawk.to live chat widget for your Veltrix IPTV website.

## Setup Instructions

1. **Create a Tawk.to account**:
   - Go to [tawk.to](https://www.tawk.to/) and sign up for an account
   - Create a new site in your dashboard

2. **Get your Tawk.to credentials**:
   - From your Tawk.to dashboard, go to Administration > Property Settings
   - Under the "Widget Code" section, you'll find a code snippet like:
     ```
     <!--Start of Tawk.to Script-->
     <script type="text/javascript">
     var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
     (function(){
     var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
     s1.async=true;
     s1.src='https://embed.tawk.to/YOUR_SITE_ID/YOUR_WIDGET_ID';
     s1.charset='UTF-8';
     s1.setAttribute('crossorigin','*');
     s0.parentNode.insertBefore(s1,s0);
     })();
     </script>
     <!--End of Tawk.to Script-->
     ```
   - Extract `YOUR_SITE_ID` and `YOUR_WIDGET_ID` from the script

3. **Add your credentials to your .env.local file**:
   ```
   NEXT_PUBLIC_TAWK_SITE_ID=YOUR_SITE_ID
   NEXT_PUBLIC_TAWK_WIDGET_ID=YOUR_WIDGET_ID
   ```

## How It Works

- The Tawk widget is implemented in `/src/components/ui/tawk-chat.tsx`
- It's integrated into the site layout in `/src/app/layout.tsx`
- The widget only loads in production mode to avoid cluttering your development environment
- You can test it by temporarily removing the `process.env.NODE_ENV === 'production'` condition

## Customization Options

You can customize the Tawk.to widget appearance directly from the Tawk.to dashboard:

1. **Appearance**: Change colors, position, and styling to match your brand
2. **Chat Widget**: Customize the chat window appearance
3. **Pre-Chat Form**: Configure what information to collect from visitors
4. **Triggers**: Set up proactive chat invitations based on time on page, pages visited, etc.

## Advanced Integration

To add more advanced features like visitor identification or custom events:

1. **Add Tawk_API before the widget loads**:
   ```jsx
   <script 
     type="text/javascript" 
     dangerouslySetInnerHTML={{
       __html: `
         var Tawk_API = Tawk_API || {};
         Tawk_API.visitor = {
           name: 'User name',
           email: 'user@example.com'
         };
       `
     }}
   />
   ```

2. **Creating an enhanced TawkChat component**:
   - Update the `tawk-chat.tsx` component to accept user information
   - Add methods to send custom events or update visitor information

## Troubleshooting

If the widget isn't appearing:

1. Verify your Site ID and Widget ID are correct
   - Make sure to carefully check the widget ID - sometimes the Tawk.to dashboard shows a different ID than what's in the actual script
   - In our case, we had a discrepancy: `Y1irelrb2r` vs `1irelrb2r` (notice the "Y" prefix)
2. Check if any content blockers are preventing the script from loading
3. Ensure there are no JavaScript errors in the console
4. Try loading the site in an incognito window
5. Check browser console for any potential error messages from the Tawk.to script

## Privacy Considerations

- The Tawk.to widget sets cookies for visitor tracking
- Update your privacy policy to disclose the use of Tawk.to
- Consider adding a cookie consent banner if serving EU visitors

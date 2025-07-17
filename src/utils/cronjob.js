import cron from 'node-cron';
import ConnectionRequest from '../models/connectionRequest.js';
import { startOfDay, subDays, endOfDay } from 'date-fns';
import run from './sendEmail.js';

const startCronJob = () => {
  cron.schedule('0 8 * * *', async () => {
   try{

    const yesterDay = subDays(new Date(),1);
    const yesterDayStart = startOfDay(yesterDay);
    const yesterDayEnd = endOfDay(yesterDay);
        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt:{
                $gte: yesterDayStart,
                $lt: yesterDayEnd,
            },
        }).populate("fromUserId toUserId");

        const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    for (const email of listOfEmails) {
      // Send Emails
      try {
        const res = await run(
          "New Friend Requests pending for " + email,
          "There are so many friend requests pending, please login to wetinder.info and accept or reject the requests."
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
   }catch(error){
     console.error(error);
   }
  });
};

export default startCronJob;
using FftProgressiveWebApp.Models.Weather;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace FftProgressiveWebApp.Controllers
{
    public class WeatherController : ApiController
    {
        // GET api/weather
        public async Task<WeatherModel> GetWeatherModel()
        {
            var messages = new List<string>
            {
                "Sunny",
                "Cloudy",
                "Rain",
                "Snow",
                "Blizzard"
            };

            var model = new WeatherModel()
            {
                Message = messages[new Random().Next(messages.Count)],
                Date = DateTime.Now.ToString()
            };

            // A small delay
            await Task.Delay(millisecondsDelay: 1000);

            return model;
        }
    }
}
